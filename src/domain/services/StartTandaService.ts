import { Tanda } from "../entities/Tanda"

export class StartTandaService {
  canStart(tanda: Tanda): boolean {
    return tanda.canStart()
  }
}
