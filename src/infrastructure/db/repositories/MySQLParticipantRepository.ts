import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { ParticipantEntity } from '../entities/ParticipantEntity';
import { ParticipantRepository } from '../../../domain/ports/ParticipantRepository';
import { Participant } from '../../../domain/entities/Participant';

export class MySQLParticipantRepository implements ParticipantRepository {
  private repository: Repository<ParticipantEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ParticipantEntity);
  }

  async save(participant: Participant): Promise<void> {
    const existing = await this.repository.findOne({
      where: {
        userId: participant.userId,
        tandaId: participant.tandaId,
      }
    });

    const data: Partial<ParticipantEntity> = {
      userId: participant.userId,
      tandaId: participant.tandaId,
      turnNumber: participant.turn || undefined,
      status: participant.expelled ? 'inactive' : 'active',
      payoutDate: participant.alreadyPaid ? (existing?.payoutDate || new Date()) : undefined
    };

    if (existing) {
      await this.repository.update(existing.id, data);
    } else {
      const participantEntity = this.repository.create(data);
      await this.repository.save(participantEntity);
    }
  }

  async findByUserAndTanda(userId: number, tandaId: number): Promise<Participant | null> {
    const participant = await this.repository.findOne({
      where: { userId, tandaId }
    });
    
    return participant ? this.toDomain(participant) : null;
  }

  async findByTanda(tandaId: number): Promise<Participant[]> {
    const participants = await this.repository.find({ 
      where: { tandaId } 
    });
    
    return participants.map(p => this.toDomain(p));
  }

  async findDetailedByTanda(tandaId: number): Promise<{
    userId: number;
    name: string;
    photo: string | null;
    alreadyPaid: boolean;
  }[]> {
    const results = await this.repository
      .createQueryBuilder('participant')
      .innerJoinAndSelect('participant.user', 'user')
      .select([
        'user.id as userId',
        'user.name as name',
        'user.photo as photo',
        'participant.payoutDate as payoutDate'
      ])
      .where('participant.tandaId = :tandaId', { tandaId })
      .getRawMany();
    
    return results.map(row => ({
      userId: row.userId,
      name: row.name,
      photo: row.photo || null,
      alreadyPaid: row.payoutDate !== null
    }));
  }

  async delete(userId: number, tandaId: number): Promise<void> {
    await this.repository.delete({ userId, tandaId });
  }

  private toDomain(entity: ParticipantEntity): Participant {
    return new Participant(
      entity.id,
      entity.userId,
      entity.tandaId,
      entity.turnNumber || 0,
      entity.payoutDate !== null && entity.payoutDate !== undefined,
      entity.status === 'inactive',
      entity.joinedAt
    );
  }
}