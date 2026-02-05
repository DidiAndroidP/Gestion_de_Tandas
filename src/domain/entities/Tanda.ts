export type TandaStatus = "created" | "in_progress" | "finished"
export type PaymentFrequency = "weekly" | "biweekly" | "monthly"

export class Tanda {
  private participants: number[] = []

  constructor(
    public readonly id: number,
    public name: string,
    public contributionAmount: number,
    public paymentFrequency: PaymentFrequency,
    public totalMembers: number,
    public delayToleranceDays: number,
    public penaltyPerDay: number,
    public status: TandaStatus,
    public readonly creatorId: number,
    public readonly createdAt: Date,
    public startDate: Date | null,
    existingParticipants: number[] = []
  ) {
    this.participants = existingParticipants
  }

  addParticipant(userId: number): void {
    if (this.status !== "created") {
      throw new Error("Cannot add participants")
    }

    if (this.participants.includes(userId)) {
      throw new Error("User already joined")
    }

    if (this.participants.length >= this.totalMembers) {
      throw new Error("Tanda is full")
    }

    this.participants.push(userId)
  }

  canStart(): boolean {
    return (
      this.status === "created" &&
      this.participants.length === this.totalMembers
    )
  }

  start(): void {
    if (!this.canStart()) {
      throw new Error("Tanda cannot be started")
    }
    this.status = "in_progress"
    this.startDate = new Date()
  }

  finish(): void {
    this.status = "finished"
  }

  isActive(): boolean {
    return this.status === "in_progress"
  }

  currentParticipants(): number {
    return this.participants.length
  }

  calculatePenalty(delayDays: number): number {
    if (delayDays <= 0) return 0
    return delayDays * this.penaltyPerDay
  }
}