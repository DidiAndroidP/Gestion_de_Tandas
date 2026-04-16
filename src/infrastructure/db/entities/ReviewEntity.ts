import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { UserEntity } from './UserEntity'
import { TandaEntity } from './TandaEntity'

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'reviewer_id' })
  reviewerId!: number

  @Column({ name: 'creator_id' })
  creatorId!: number

  @Column({ name: 'tanda_id' })
  tandaId!: number

  @Column({ type: 'int' })
  score!: number

  @Column({ type: 'text', nullable: true })
  comment!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer!: UserEntity

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator!: UserEntity

  @ManyToOne(() => TandaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tanda_id' })
  tanda!: TandaEntity
}