import { Participant } from "../entities/Participant";

export interface ParticipantRepository {
  save(participant: Participant): Promise<void>;

  findByUserAndTanda(
    userId: number,
    tandaId: number
  ): Promise<Participant | null>;

  findByTanda(tandaId: number): Promise<Participant[]>;

  delete(userId: number, tandaId: number): Promise<void>;
}