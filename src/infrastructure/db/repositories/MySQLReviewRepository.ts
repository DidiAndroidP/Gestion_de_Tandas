import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { ReviewEntity } from '../entities/ReviewEntity'
import { ReviewRepository } from '../../../domain/ports/ReviewRepository'
import { Review } from '../../../domain/entities/Review'

export class MySQLReviewRepository implements ReviewRepository {
  private repository: Repository<ReviewEntity>

  constructor() {
    this.repository = AppDataSource.getRepository(ReviewEntity)
  }

  async save(review: Review): Promise<void> {
    const entity = this.repository.create({
      reviewerId: review.reviewerId,
      creatorId: review.creatorId,
      tandaId: review.tandaId,
      score: review.score,
      comment: review.comment
    })
    await this.repository.save(entity)
  }

  async findByCreator(creatorId: number): Promise<Review[]> {
    const reviews = await this.repository.find({ 
      where: { creatorId },
      order: { createdAt: 'DESC' }
    })
    return reviews.map(r => this.toDomain(r))
  }

  async getAverageScore(creatorId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("review")
      .select("AVG(review.score)", "average")
      .where("review.creatorId = :creatorId", { creatorId })
      .getRawOne()
      
    return result.average ? parseFloat(result.average) : 0
  }

  async hasUserReviewed(reviewerId: number, tandaId: number): Promise<boolean> {
    const count = await this.repository.count({
      where: { reviewerId, tandaId }
    })
    return count > 0
  }

  private toDomain(entity: ReviewEntity): Review {
    return new Review(
      entity.id,
      entity.reviewerId,
      entity.creatorId,
      entity.tandaId,
      entity.score,
      entity.comment,
      entity.createdAt
    )
  }
}