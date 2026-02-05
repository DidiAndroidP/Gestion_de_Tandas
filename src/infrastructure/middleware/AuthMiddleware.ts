import { Request, Response, NextFunction } from "express"
import { AuthRepository } from "../../domain/ports/AuthRepository"

export const createAuthMiddleware = (authRepository: AuthRepository) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    try {
      const decoded = authRepository.verifyToken(token)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" })
    }
  }
}