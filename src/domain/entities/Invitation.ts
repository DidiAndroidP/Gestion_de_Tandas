export type InvitationStatus = "pending" | "accepted" | "rejected" | "expired"

export class Invitation {
  constructor(
    public readonly id: number | null,
    public readonly tandaId: number,
    public readonly email: string,
    public status: InvitationStatus,
    public readonly token: string
  ) {}

  accept(): void {
    if (this.status !== "pending") {
      throw new Error("Invitation cannot be accepted")
    }
    this.status = "accepted"
  }

  reject(): void {
    this.status = "rejected"
  }
  
  expire(): void {
    if (this.status === "pending") {
        this.status = "expired";
    }
  }
}