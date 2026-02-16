import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TandaEntity } from './TandaEntity';
import { UserEntity } from './UserEntity';

@Entity('invitations')
export class InvitationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'tanda_id' })
  tandaId!: number;

  @Column({ name: 'invited_user_id', nullable: true })
  invitedUserId!: number;

  @Column({ length: 255 })
  email!: string;

  @Column({ unique: true, length: 100 })
  token!: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'expired', 'rejected'], default: 'pending' })
  status!: 'pending' | 'accepted' | 'expired' | 'rejected';

  @Column({ type: 'datetime', name: 'expires_at' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => TandaEntity, tanda => tanda.invitations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tanda_id' })
  tanda!: TandaEntity;

  @ManyToOne(() => UserEntity, user => user.receivedInvitations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invited_user_id' })
  invitedUser!: UserEntity;
}