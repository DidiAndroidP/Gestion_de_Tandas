import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ParticipantEntity } from './ParticipantEntity';
import { InvitationEntity } from './InvitationEntity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 500, nullable: true })
  photo?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'fcm_token' })
  fcmToken?: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'guest'], default: 'user' })
  role!: 'admin' | 'user' | 'guest';

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ name: 'failed_attempts', default: 0 })
  failedAttempts!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => ParticipantEntity, participant => participant.user)
  participations!: ParticipantEntity[];

  @OneToMany(() => InvitationEntity, invitation => invitation.invitedUser)
  receivedInvitations!: InvitationEntity[];
}