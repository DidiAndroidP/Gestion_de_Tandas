import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { InvitationEntity } from '../entities/InvitationEntity';
import { InvitationRepository } from '../../../domain/ports/InvitationRepository';
import { Invitation } from '../../../domain/entities/Invitation';

export class MySQLInvitationRepository implements InvitationRepository {
  private repository: Repository<InvitationEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(InvitationEntity);
  }

  async save(invitation: Invitation): Promise<void> {
    const existing = await this.repository.findOne({
      where: {
        tandaId: invitation.tandaId,
        email: invitation.email,
      }
    });

    if (existing) {
      await this.repository.update(existing.id, {
        status: invitation.status,
      });
    } else {
      const invitationEntity = this.repository.create({
        tandaId: invitation.tandaId,
        email: invitation.email,
        status: invitation.status,
        token: invitation.token,
      });
      
      await this.repository.save(invitationEntity);
    }
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const invitation = await this.repository.findOne({ 
      where: { token } 
    });
    
    return invitation ? this.toDomain(invitation) : null;
  }

  private toDomain(entity: InvitationEntity): Invitation {
    return new Invitation(
      entity.id,
      entity.tandaId,
      entity.email,
      entity.status,
      entity.token
    );
  }
}