import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';
import { ImageStoragePort } from '../../domain/ports/ImageStoragePort';

export class S3ImageService implements ImageStoragePort {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucketName = process.env.AWS_S3_BUCKET || '';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadImage(
    file: Buffer,
    folder: string = 'images',
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): Promise<string> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 80,
      format = 'webp',
    } = options;

    try {
      const compressedImage = await sharp(file)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(format, { quality })
        .toBuffer();

      const fileName = this.generateFileName(format);
      const key = `${folder}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: compressedImage,
        ContentType: `image/${format}`,
      });

      await this.s3Client.send(command);

      return this.getPublicUrl(key);
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(imageUrl);

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting image from S3:', error);
      throw new Error('Failed to delete image');
    }
  }

  async validateImage(file: Buffer): Promise<boolean> {
    try {
      const metadata = await sharp(file).metadata();
      const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
      return validFormats.includes(metadata.format || '');
    } catch {
      return false;
    }
  }

  async uploadImageWithVersions(
    file: Buffer,
    folder: string = 'images'
  ): Promise<{ thumbnail: string; medium: string; large: string; original: string }> {
    const baseName = crypto.randomBytes(16).toString('hex');

    try {
      const thumbnail = await this.uploadVersion(file, folder, `${baseName}-thumb`, 150, 150, 60);
      const medium    = await this.uploadVersion(file, folder, `${baseName}-medium`, 500, 500, 75);
      const large     = await this.uploadVersion(file, folder, `${baseName}-large`, 1200, 1200, 85);
      const original  = await this.uploadVersion(file, folder, `${baseName}-original`, undefined, undefined, 90);

      return { thumbnail, medium, large, original };
    } catch (error) {
      console.error('Error uploading image versions:', error);
      throw new Error('Failed to upload image versions');
    }
  }

  async deleteImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map((url) => this.deleteImage(url));
    await Promise.all(deletePromises);
  }

  async getImageInfo(file: Buffer): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
  }> {
    const metadata = await sharp(file).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: file.length,
    };
  }

  private async uploadVersion(
    file: Buffer,
    folder: string,
    fileName: string,
    width?: number,
    height?: number,
    quality: number = 80
  ): Promise<string> {
    let imageProcessor = sharp(file);

    if (width && height) {
      imageProcessor = imageProcessor.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const compressedImage = await imageProcessor
      .toFormat('webp', { quality })
      .toBuffer();

    const key = `${folder}/${fileName}.webp`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: compressedImage,
      ContentType: 'image/webp',
    });

    await this.s3Client.send(command);

    return this.getPublicUrl(key);
  }

  private generateFileName(format: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${random}.${format}`;
  }

  private getPublicUrl(key: string): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  private extractKeyFromUrl(url: string): string {
    const urlParts = url.split('.amazonaws.com/');
    if (urlParts.length < 2) {
      throw new Error('Invalid S3 URL');
    }
    return urlParts[1];
  }
}

export const s3ImageService = new S3ImageService();