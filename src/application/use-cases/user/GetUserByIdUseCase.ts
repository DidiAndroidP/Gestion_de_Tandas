import { ImageStoragePort } from "../../../domain/ports/ImageStoragePort";
import { UserRepository } from "../../../domain/ports/UserRepository"
import { UserResponseDTO } from "../../dtos/user/UserResponseDTO"

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageStorage: ImageStoragePort
  ) {}

  async execute(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    let finalPhotoUrl = user.photo;

    if (user.photo) {
      finalPhotoUrl = await this.imageStorage.getPublicUrl(user.photo, {
        width: 800,
        height: 800,
        crop: 'fill',
        format: 'auto',
        quality: 'auto'
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: finalPhotoUrl,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt
    };
  }
}
