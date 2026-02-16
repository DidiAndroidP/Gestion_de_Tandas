export type UserRole = "admin" | "user" | "guest"

export class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public passwordHash: string,
    public phone: string | null,
    public photo: string | null,  
    public role: UserRole,
    public active: boolean,
    public failedAttempts: number,
    public readonly createdAt: Date
  ) {}
  
  updatePhoto(photoUrl: string | null): void {
    this.photo = photoUrl
  }

  hasPhoto(): boolean {
    return this.photo !== null && this.photo !== ""
  }

  activate(): void {
    this.active = true
    this.failedAttempts = 0
  }

  deactivate(): void {
    this.active = false
  }

  registerFailedAttempt(): void {
    this.failedAttempts++
    if (this.failedAttempts >= 5) {
      this.deactivate()
    }
  }

  canCreateTanda(): boolean {
    return this.active && this.role !== "guest"
  }

  isAdmin(): boolean {
    return this.role === "admin"
  }
}