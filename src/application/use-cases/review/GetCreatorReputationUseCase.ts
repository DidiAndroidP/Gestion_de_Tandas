import { ReviewRepository } from "../../../domain/ports/ReviewRepository"

export class GetCreatorReputationUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(creatorId: number) {
    const averageScore = await this.reviewRepository.getAverageScore(creatorId)
    const reviews = await this.reviewRepository.findByCreator(creatorId)
    
    return {
      creatorId,
      averageScore: Number(averageScore.toFixed(1)),
      totalReviews: reviews.length,
      reviews: reviews.map(r => ({
        reviewerId: r.reviewerId,
        tandaId: r.tandaId,
        score: r.score,
        comment: r.comment,
        date: r.createdAt
      }))
    }
  }
}