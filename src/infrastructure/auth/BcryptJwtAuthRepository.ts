import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AuthRepository } from "../../domain/ports/AuthRepository"

export class BcryptJwtAuthRepository implements AuthRepository {
  private readonly secret: string

  constructor() {
    this.secret = process.env.JWT_SECRET || "default_secret"
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed)
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: "24h" })
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secret)
  }
}