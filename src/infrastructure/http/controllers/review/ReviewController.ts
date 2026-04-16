import { Request, Response } from "express"
import { CreateReviewUseCase } from "../../../../application/use-cases/review/CreateReviewUseCase"
import { GetCreatorReputationUseCase } from "../../../../application/use-cases/review/GetCreatorReputationUseCase"

export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getCreatorReputationUseCase: GetCreatorReputationUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      await this.createReviewUseCase.execute({
        reviewerId: req.user!.userId,
        tandaId: req.body.tandaId,
        score: req.body.score,
        comment: req.body.comment
      })
      res.status(201).json({ message: "Reseña guardada exitosamente" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getReputation(req: Request, res: Response) {
    try {
      const reputation = await this.getCreatorReputationUseCase.execute(Number(req.params.creatorId))
      res.status(200).json(reputation)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}