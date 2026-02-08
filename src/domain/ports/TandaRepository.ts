import { Tanda } from "../entities/Tanda"

export interface TandaRepository {
  findById(id: number): Promise<Tanda | null>
  save(tanda: Tanda): Promise<number>
  update(tanda: Tanda): Promise<void>
  findAvailable(): Promise<Tanda[]>
  deleteById(id: number): Promise<void>
}
