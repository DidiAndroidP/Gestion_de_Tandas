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
      throw new Error("No se pueden agregar participantes porque la tanda ya inició o finalizó.")
    }

    if (this.participants.includes(userId)) {
      throw new Error("Este usuario ya forma parte de la tanda.")
    }

    if (this.participants.length >= this.totalMembers) {
      throw new Error("La tanda ya está completa.")
    }

    this.participants.push(userId)
  }

  minimumParticipantsToStart(): number {
    return Math.ceil(this.totalMembers * 0.7)
  }

  canStart(): boolean {
    return (
      this.status === "created" &&
      this.participants.length >= this.minimumParticipantsToStart()
    )
  }

  start(): void {
    if (!this.canStart()) {
      throw new Error(
        `No se puede iniciar la tanda. Se requieren mínimo ${this.minimumParticipantsToStart()} participantes y actualmente hay ${this.participants.length}.`
      )
    }

    this.status = "in_progress"
    this.startDate = new Date()
  }

  finish(): void {
    if (this.status !== "in_progress") {
      throw new Error("Solo una tanda en curso puede finalizarse.")
    }

    this.status = "finished"
  }

  isStarted(): boolean {
    return this.status === "in_progress"
  }

  currentParticipants(): number {
    return this.participants.length
  }
}