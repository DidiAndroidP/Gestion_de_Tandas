import { Tanda } from "../entities/Tanda"

export interface TandaRepository {
  save(tanda: Tanda): Promise<Tanda>
  update(tanda: Tanda): Promise<void>
  findById(id: number): Promise<Tanda | null>
  findByCreadorId(creadorId: number): Promise<Tanda[]>
}
