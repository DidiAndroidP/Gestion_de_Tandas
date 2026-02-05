import { Invitation } from '../entities/Invitation';

export interface InvitationRepository {
  save(invitation: Invitation): Promise<void>;
  findByToken(token: string): Promise<Invitation | null>;
}
