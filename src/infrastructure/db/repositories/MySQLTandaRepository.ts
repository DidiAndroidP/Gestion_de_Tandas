import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { TandaEntity } from '../entities/TandaEntity';
import { TandaRepository } from '../../../domain/ports/TandaRepository';
import { Tanda } from '../../../domain/entities/Tanda';

export class MySQLTandaRepository implements TandaRepository {
  private repository: Repository<TandaEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(TandaEntity);
  }

  async findById(id: number): Promise<Tanda | null> {
    const tanda = await this.repository.findOne({ where: { id } });
    return tanda ? this.toDomain(tanda) : null;
  }

  async save(tanda: Tanda): Promise<number> {
    const data: Partial<TandaEntity> = {
      name: tanda.name,
      contributionAmount: tanda.contributionAmount,
      paymentFrequency: tanda.paymentFrequency,
      maxParticipants: tanda.totalMembers,
      delayToleranceDays: tanda.delayToleranceDays,
      penaltyPerDay: tanda.penaltyPerDay,
      status: tanda.status,
      creatorId: tanda.creatorId,
    };

    if (tanda.id && tanda.id !== 0) {
      await this.repository.update(tanda.id, data);
      return tanda.id;
    } else {
      const tandaEntity = this.repository.create(data);
      const saved = await this.repository.save(tandaEntity);
      return saved.id;
    }
  }

  async update(tanda: Tanda): Promise<void> {
    await this.repository.update(tanda.id, {
      status: tanda.status,
    });
  }

  async findAvailable(): Promise<Tanda[]> {
    const tandas = await this.repository.find({ 
      where: { status: 'created' } 
    });
    
    return tandas.map(tanda => this.toDomain(tanda));
  }

  async findByUserId(userId: number): Promise<Tanda[]> {
    const tandas = await this.repository.createQueryBuilder("tanda")
      .innerJoin("participants", "participant", "participant.tanda_id = tanda.id")
      .where("participant.user_id = :userId", { userId })
      .getMany();

    return tandas.map(tanda => this.toDomain(tanda));
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: TandaEntity): Tanda {
    const tanda = new Tanda(
      entity.id,
      entity.name,
      Number(entity.contributionAmount),
      entity.paymentFrequency,
      entity.maxParticipants,
      entity.delayToleranceDays,
      Number(entity.penaltyPerDay),
      entity.status,
      entity.creatorId,
      entity.createdAt
    );
    return tanda;
  }
}