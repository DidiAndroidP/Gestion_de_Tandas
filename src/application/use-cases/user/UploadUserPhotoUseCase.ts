import { s3ImageService } from '../../../infrastructure/utils/S3ImageService';
import { UserRepository } from '../../../domain/ports/UserRepository';

export class UploadUserPhotoUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    userId: number,
    imageBuffer: Buffer
  ): Promise<{ photoUrl: string }> {
    const isValid = await s3ImageService.validateImage(imageBuffer);
    if (!isValid) {
      throw new Error('Invalid image file');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.photo) {
      try {
        await s3ImageService.deleteImage(user.photo);
      } catch (error) {
        console.error('Error deleting old photo:', error);
      }
    }

    const photoUrl = await s3ImageService.uploadImage(
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