import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../../application/use-cases/user/CreateUserUseCase";
import { LoginUseCase } from "../../../../application/use-cases/auth/LoginUseCase";

export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      const { passwordHash, ...userWithoutPass } = user;
      res.status(201).json(userWithoutPass);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}