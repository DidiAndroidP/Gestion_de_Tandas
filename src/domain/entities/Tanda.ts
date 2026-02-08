export type TandaStatus = "created" | "in_progress" | "finished"

export class Tanda {
  private participants: number = 0

  constructor(
    public id: number,
    public readonly name: string,
    public readonly contributionAmount: number,
    public readonly paymentFrequency: string,
    public readonly totalMembers: number,
    public readonly delayToleranceDays: number,
    public readonly penaltyPerDay: number,
    public status: TandaStatus,
    public readonly creatorId: number,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    name: string
    contributionAmount: number
    paymentFrequency: string
    totalMembers: number
    delayToleranceDays: number
    penaltyPerDay: number
    creatorId: number
  }): Tanda {
    return new Tanda(
      0,
      props.name,
      props.contributionAmount,
      props.paymentFrequency,
      props.totalMembers,
      props.delayToleranceDays,
      props.penaltyPerDay,
      "created",
      props.creatorId,
      new Date()
    )
  }

  setId(id: number): void {
    this.id = id
  }

  incrementParticipants(): void {
    this.participants++
  }

  currentParticipants(): number {
    return this.participants
  }

  start(): void {
    if (this.status !== "created") {
      throw new Error("Tanda cannot be started")
    }
    this.status = "in_progress"
  }

  finish(): void {
    if (this.status !== "in_progress") {
      throw new Error("Tanda cannot be finished")
    }
    this.status = "finished"
  }

  canStartWith(currentParticipants: number): boolean {
    return currentParticipants >= this.totalMembers
  }
}
