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

  canPay(): boolean {
    return !this.expelled
  }

  markAsPaid(): void {
    if (this.alreadyPaid) {
      throw new Error('Participant already received payment')
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