export interface AuthRepository {
  hashPassword(password: string): Promise<string>
  comparePassword(plain: string, hashed: string): Promise<boolean>
  generateToken(payload: object): string
  verifyToken(token: string): any
}