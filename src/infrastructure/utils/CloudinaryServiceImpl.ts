import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import ImageMetadata from "../../application/dtos/user/ImageMetadataDto";
import { ImageStoragePort } from "../../domain/ports/ImageStoragePort";

export class CloudinaryServiceImpl implements ImageStoragePort {
    constructor() {
        if (!process.env.CLOUDINARY_URL) {
            throw new Error('CLOUDINARY_URL environment variable is required');
        }
        cloudinary.config({
            secure: true
        });
    }

    async uploadImage(
        file: Buffer,
        folder: string,
        options?: {
            maxWidth?: number;
            maxHeight?: number;
            quality?: number;
            format?: 'jpeg' | 'png' | 'webp' | 'auto';
        }
    ): Promise<{ publicId: string; url: string }> {
        try {
            const uploadOptions: any = {
                folder,
                resource_type: 'image',
                overwrite: true,
                faces: true,
                colors: true
            };

            // FIX: Pasamos los valores limpios, sin prefijos 'q_' o similares
            if (options?.maxWidth || options?.maxHeight) {
                uploadOptions.eager = [{
                    width: options.maxWidth || undefined,
                    height: options.maxHeight || undefined,
                    crop: 'limit',
                    quality: options.quality || 'auto',
                    fetch_format: options.format || 'auto'
                }];
            }

            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Upload failed'));
                        resolve(result);
                    }
                );
                stream.end(file);
            });

            const url = result.eager?.[0]?.secure_url || result.secure_url;

            return {
                publicId: result.public_id,
                url
            };

        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    
    async deleteImage(publicId: string): Promise<void> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
        
            if (result.result !== 'ok' && result.result !== 'not found') {
                throw new Error(`Delete failed: ${result.result}`);
            }
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateImage(file: Buffer): Promise<boolean> {
        try {
            const metadata = await sharp(file).metadata();
            const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'avif', 'tiff'];
            return validFormats.includes(metadata.format || '');
        } catch {
            return false;
        }
    }

    async getImageInfo(file: Buffer): Promise<ImageMetadata> {
        const metadata = await sharp(file).metadata();
        return {
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: file.length
        };
    }

    async getPublicUrl(
        publicId: string,
        options?: {
            width?: number;
            height?: number;
            quality?: 'auto' | number;
            format?: 'jpeg' | 'png' | 'webp' | 'auto';
            crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
            gravity?: 'auto' | 'face' | 'center';
        }
    ): Promise<string> {
        // FIX: En lugar de concatenar arrays con w_, h_, etc. 
        // Le pasamos el objeto limpio a Cloudinary y él arma la URL perfecta
        const cloudinaryOptions: any = {
            secure: true,
            quality: options?.quality || 'auto',
            fetch_format: options?.format || 'auto'
        };

        if (options?.width) cloudinaryOptions.width = options.width;
        if (options?.height) cloudinaryOptions.height = options.height;
        if (options?.crop) cloudinaryOptions.crop = options.crop;
        if (options?.gravity) cloudinaryOptions.gravity = options.gravity;

        return cloudinary.url(publicId, cloudinaryOptions);
    }
}

export const cloudinaryService = new CloudinaryServiceImpl();