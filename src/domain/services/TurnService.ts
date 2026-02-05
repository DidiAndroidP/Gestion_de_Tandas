import { Participant } from "../entities/Participant"

export class TurnService {
  assignTurn(participants: Participant[]): number {
    if (participants.length === 0) return 1
    const turns = participants.map(p => p.turn)
    return Math.max(...turns) + 1
  }
}
