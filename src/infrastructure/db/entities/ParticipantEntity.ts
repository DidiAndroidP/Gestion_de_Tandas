import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from './UserEntity';
import { TandaEntity } from './TandaEntity';
import { PaymentEntity } from './PaymentEntity';

@Entity('participants')
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'tanda_id' })
  tandaId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'turn_number', nullable: true })
  turnNumber?: number;

  @Column({ type: 'date', name: 'payout_date', nullable: true })
  payoutDate?: Date;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status!: 'active' | 'inactive';

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt!: Date;

  // Relaciones
  @ManyToOne(() => TandaEntity, tanda => tanda.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tanda_id' })
  tanda!: TandaEntity;

  @ManyToOne(() => UserEntity, user => user.participations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @OneToMany(() => PaymentEntity, payment => payment.participant)
  payments!: PaymentEntity[];
}