import { Participant } from '../entities/Participant';

export interface ParticipantRepository{
  save(participant: Participant): Promise<void>;
  findByUsuarioYTanda(usuarioId: number, tandaId: number): Promise<Participant | null>;
  findByTanda(tandaId: number): Promise<Participant[]>;
}
