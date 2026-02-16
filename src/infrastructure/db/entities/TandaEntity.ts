import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ParticipantEntity } from './ParticipantEntity';
import { InvitationEntity } from './InvitationEntity';

@Entity('tandas')
export class TandaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'contribution_amount' })
  contributionAmount!: number;

  @Column({ name: 'payment_frequency' })
  paymentFrequency!: string;

  @Column({ name: 'max_participants' })
  maxParticipants!: number;

  @Column({ name: 'delay_tolerance_days', default: 0 })
  delayToleranceDays!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'penalty_per_day', default: 0 })
  penaltyPerDay!: number;

  @Column({ name: 'creator_id' })
  creatorId!: number;

  @Column({ type: 'enum', enum: ['created', 'in_progress', 'finished'], default: 'created' })
  status!: 'created' | 'in_progress' | 'finished';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => ParticipantEntity, participant => participant.tanda)
  participants!: ParticipantEntity[];

  @OneToMany(() => InvitationEntity, invitation => invitation.tanda)
  invitations!: InvitationEntity[];
}