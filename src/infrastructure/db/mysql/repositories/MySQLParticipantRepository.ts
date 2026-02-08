import { ParticipantRepository } from "../../../../domain/ports/ParticipantRepository"
import { Participant } from "../../../../domain/entities/Participant"
import { db } from "../MySQLConnection"

export class MySQLParticipantRepository implements ParticipantRepository {

  async save(participant: Participant): Promise<void> {
    await db.execute(
      `INSERT INTO participants (user_id, tanda_id, turn, already_paid, expelled)
       VALUES (?, ?, ?, ?, ?)`,
      [
        participant.userId,
        participant.tandaId,
        participant.turn,
        participant.alreadyPaid,
        participant.expelled
      ]
    )
  }

  async findByUserAndTanda(userId: number, tandaId: number): Promise<Participant | null> {
    const [rows] = await db.execute(
      `SELECT * FROM participants WHERE user_id = ? AND tanda_id = ?`,
      [userId, tandaId]
    )

    const data = rows as any[]
    if (!data.length) return null

    const p = data[0]
    return new Participant(
      p.id,
      p.user_id,
      p.tanda_id,
      p.turn,
      Boolean(p.already_paid),
      Boolean(p.expelled),
      new Date(p.created_at)
    )
  }

  async findByTanda(tandaId: number): Promise<Participant[]> {
    const [rows] = await db.execute(
      `SELECT * FROM participants WHERE tanda_id = ?`,
      [tandaId]
    )

    return (rows as any[]).map(p =>
      new Participant(
        p.id,
        p.user_id,
        p.tanda_id,
        p.turn,
        Boolean(p.already_paid),
        Boolean(p.expelled),
        new Date(p.created_at)
      )
    )
  }

  async findDetailedByTanda(tandaId: number) {
    const [rows] = await db.execute(
      `SELECT 
        u.id as userId,
        u.name,
        NULL as photo,
        p.already_paid as alreadyPaid
      FROM participants p
      JOIN users u ON u.id = p.user_id
      WHERE p.tanda_id = ?`,
      [tandaId]
    )

    return rows as {
      userId: number
      name: string
      photo: string | null
      alreadyPaid: boolean
    }[]
  }

  async delete(userId: number, tandaId: number): Promise<void> {
    await db.execute(
      `DELETE FROM participants WHERE user_id = ? AND tanda_id = ?`,
      [userId, tandaId]
    )
  }
}
