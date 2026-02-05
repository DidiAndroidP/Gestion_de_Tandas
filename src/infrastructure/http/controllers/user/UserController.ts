import { Request, Response } from "express";
import { GetUserByIdUseCase } from "../../../../application/use-cases/user/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../../../application/use-cases/user/UpdateUserUseCase";
import { ActivateUserUseCase } from "../../../../application/use-cases/user/ActivateUserUseCase";

export class UserController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase
  ) {}

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
}