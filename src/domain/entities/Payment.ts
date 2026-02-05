export type PaymentStatus = "pending" | "paid" | "late"

export class Payment {
  constructor(
    public readonly id: number,
    public readonly participantId: number,
    public period: number,
    public amount: number,
    public status: PaymentStatus,
    public dueDate: Date,
    public paymentDate: Date | null,
    public penalty: number
  ) {}

  markAsPaid(date: Date, penalty: number): void {
    if (this.status === "paid") {
      throw new Error("Payment already registered")
    }

    this.status = "paid"
    this.paymentDate = date
    this.penalty = penalty
  }

  isLate(today: Date): boolean {
    return today > this.dueDate && this.status === "pending"
  }
}
