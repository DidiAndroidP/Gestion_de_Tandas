import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ParticipantEntity } from './ParticipantEntity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'participant_id' })
  participantId!: number;

  @Column()
  period!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'date', name: 'due_date' })
  dueDate!: Date;

  @Column({ type: 'date', name: 'payment_date', nullable: true })
  paymentDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  penalty!: number;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'late'], default: 'pending' })
  status!: 'pending' | 'paid' | 'late';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => ParticipantEntity, participant => participant.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'participant_id' })
  participant!: ParticipantEntity;
}