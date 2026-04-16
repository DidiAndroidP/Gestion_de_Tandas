import { Review } from "../entities/Review"

export interface ReviewRepository {
  save(review: Review): Promise<void>
  findByCreator(creatorId: number): Promise<Review[]>
  getAverageScore(creatorId: number): Promise<number>
  hasUserReviewed(reviewerId: number, tandaId: number): Promise<boolean>
}