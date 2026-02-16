import { Request, Response } from "express";
import { GetUserByIdUseCase } from "../../../../application/use-cases/user/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../../../application/use-cases/user/UpdateUserUseCase";
import { ActivateUserUseCase } from "../../../../application/use-cases/user/ActivateUserUseCase";
import { UploadUserPhotoUseCase } from "../../../../application/use-cases/user/UploadUserPhotoUseCase";

export class UserController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
    private readonly uploadUserPhotoUseCase: UploadUserPhotoUseCase 
  ) { }

  async getById(req: Request, res: Response) {
    try {
      const idToFind = req.params.id ? Number(req.params.id) : req.user!.userId;
      const user = await this.getUserByIdUseCase.execute(idToFind);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      await this.updateUserUseCase.execute(userId, req.body);
      res.status(200).json({ message: "User updated successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async activate(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      await this.activateUserUseCase.execute(userId);
      res.status(200).json({ message: "User activated" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async uploadPhoto(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      const result = await this.uploadUserPhotoUseCase.execute(
        userId,
        req.file.buffer
      );

      res.json({
        message: 'Photo uploaded successfully',
        photoUrl: result.photoUrl,
      });
    } catch (error) {
      console.error('Error uploading photo:', error);

      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === 'Invalid image file') {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({ error: 'Failed to upload photo' });
    }
  }
}