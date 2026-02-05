import { Request, Response } from "express";
import { CreateInvitationUseCase } from "../../../../application/use-cases/invitation/CreateInvitationUseCase";
import { AcceptInvitationUseCase } from "../../../../application/use-cases/invitation/AcceptInvitationUseCase";

export class InvitationController {
  constructor(
    private readonly createInvitationUseCase: CreateInvitationUseCase,
    private readonly acceptInvitationUseCase: AcceptInvitationUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      await this.createInvitationUseCase.execute(req.body);
      res.status(201).json({ message: "Invitation sent successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async accept(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const userId = req.user!.userId; 
      await this.acceptInvitationUseCase.execute(token, userId);
      res.status(200).json({ message: "Invitation accepted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}