import { UserRepository } from "../../../../domain/ports/UserRepository"
import { User } from "../../../../domain/entities/User"
import { db } from "../MySQLConnection"

export class MySQLUserRepository implements UserRepository {

  async save(user: User): Promise<User> {
    const [result]: any = await db.execute(
      `INSERT INTO users (name, email, password_hash, phone, role, active, failed_attempts, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.name,
        user.email,
        user.passwordHash,
        user.phone,
        user.role,
        user.active,
        user.failedAttempts,
        user.createdAt
      ]
    )

    return new User(
      result.insertId,
      user.name,
      user.email,
      user.passwordHash,
      user.phone,
      user.role,
      user.active,
      user.failedAttempts,
      user.createdAt
    )
  }

  async update(user: User): Promise<void> {
    await db.execute(
      `UPDATE users 
     SET name = ?, phone = ?, active = ?, failed_attempts = ?
     WHERE id = ?`,
      [
        user.name,
        user.phone,
        user.active,
        user.failedAttempts,
        user.id
      ]
    )
  }


  async findById(id: number): Promise<User | null> {
    const [rows]: any = await db.execute(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    )

    if (rows.length === 0) return null

    const u = rows[0]
    return new User(
      u.id,
      u.name,
      u.email,
      u.password_hash,
      u.phone,
      u.role,
      u.active,
      u.failed_attempts,
      u.created_at
    )
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows]: any = await db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    )

    if (rows.length === 0) return null

    const u = rows[0]
    return new User(
      u.id,
      u.name,
      u.email,
      u.password_hash,
      u.phone,
      u.role,
      u.active,
      u.failed_attempts,
      u.created_at
    )
  }
}