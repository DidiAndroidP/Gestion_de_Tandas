import { Review } from "../../../domain/entities/Review"
import { ReviewRepository } from "../../../domain/ports/ReviewRepository"
import { TandaRepository } from "../../../domain/ports/TandaRepository"
import { ParticipantRepository } from "../../../domain/ports/ParticipantRepository"

export class CreateReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly tandaRepository: TandaRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(dto: { reviewerId: number; tandaId: number; score: number; comment: string }): Promise<void> {
    const tanda = await this.tandaRepository.findById(dto.tandaId)
    if (!tanda) throw new Error("La tanda no existe.")
    
    if (tanda.status !== "finished") {
      throw new Error("Solo puedes calificar tandas que ya han finalizado.")
    }

    if (tanda.creatorId === dto.reviewerId) {
      throw new Error("No puedes calificar tu propia tanda.")
    }

    const participant = await this.participantRepository.findByUserAndTanda(dto.reviewerId, dto.tandaId)
    if (!participant) {
      throw new Error("Solo los participantes de la tanda pueden dejar una reseña.")
    }

    const alreadyReviewed = await this.reviewRepository.hasUserReviewed(dto.reviewerId, dto.tandaId)
    if (alreadyReviewed) {
      throw new Error("Ya has dejado una reseña para esta tanda.")
    }

    const review = new Review(
      0,
      dto.reviewerId,
      tanda.creatorId,
      dto.tandaId,
      dto.score,
      dto.comment,
      new Date()
    )

    await this.reviewRepository.save(review)
  }
}