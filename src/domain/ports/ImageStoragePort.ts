export interface ImageStoragePort {
  uploadImage(
    file: Buffer,
    folder: string,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    }
  ): Promise<string>;

  deleteImage(imageUrl: string): Promise<void>;
  validateImage(file: Buffer): Promise<boolean>;
}