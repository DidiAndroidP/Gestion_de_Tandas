import { UserRepository } from '../../../domain/ports/UserRepository';
import { ImageStoragePort } from '../../../domain/ports/ImageStoragePort';

export class UploadUserPhotoUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageStorage: ImageStoragePort  
  ) {}

  async execute(
    userId: number,
    imageBuffer: Buffer
  ): Promise<{ photoUrl: string }> {
    const isValid = await this.imageStorage.validateImage(imageBuffer);
    if (!isValid) {
      throw new Error('Invalid image file');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.photo) {
      try {
        await this.imageStorage.deleteImage(user.photo);
      } catch (error) {
        console.error('Error deleting old photo:', error);
      }
    }

    const photoUrl = await this.imageStorage.uploadImage(
      imageBuffer,
      'users',
      {
        maxWidth: 800,
        maxHeight: 800,
        quality: 85,
        format: 'webp',
      }
    );

    user.photo = photoUrl;
    await this.userRepository.update(user);

    return { photoUrl };
  }
}