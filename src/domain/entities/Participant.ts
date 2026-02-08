export class Participant {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly tandaId: number,
    public turn: number,
    public alreadyPaid: boolean,
    public expelled: boolean,
    public readonly createdAt: Date
  ) {}

  static fromPersistence(row: {
    id: number
    user_id: number
    tanda_id: number
    turn: number
    already_paid: number | boolean
    expelled: number | boolean
    created_at: Date
  }): Participant {
    return new Participant(
      row.id,
      row.user_id,
      row.tanda_id,
      row.turn,
      Boolean(row.already_paid),
      Boolean(row.expelled),
      new Date(row.created_at)
    )
  }

  canPay(): boolean {
    return !this.expelled
  }

  markAsPaid(): void {
    if (this.alreadyPaid) {
      throw new Error("Participant already received payment")
    }
    this.alreadyPaid = true
  }

  expel(): void {
    this.expelled = true
  }

  assignTurn(turn: number): void {
    this.turn = turn
  }
}
