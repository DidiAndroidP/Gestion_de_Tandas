import { Participant } from "../entities/Participant"

export interface ParticipantRepository {
  save(participant: Participant): Promise<void>
  findById(id: number): Promise<Participant | null>
  findByUserAndTanda(userId: number, tandaId: number): Promise<Participant | null>
  findByTanda(tandaId: number): Promise<Participant[]>
  findDetailedByTanda(tandaId: number): Promise<{ userId: number, name: string, photo: string | null, alreadyPaid: boolean }[]>
  delete(userId: number, tandaId: number): Promise<void>
}