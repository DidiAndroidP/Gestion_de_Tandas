import ImageMetadata from "../../application/dtos/user/ImageMetadataDto";

export interface ImageStoragePort {
  uploadImage(
    file: Buffer,
    folder: string,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp' | 'auto';
    }
  ): Promise<{
    publicId: string;
    url: string;
  }>;

  deleteImage(publicId: string): Promise<void>;

  validateImage(file: Buffer): Promise<boolean>;

  getImageInfo(file: Buffer): Promise<ImageMetadata>;

  getPublicUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: 'auto' | number;
      format?: 'jpeg' | 'png' | 'webp' | 'auto';
      crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
      gravity?: 'auto' | 'face' | 'center';
    }
  ): Promise<string>;
}