import { TandaRepository } from "../../../../domain/ports/TandaRepository"
import { Tanda } from "../../../../domain/entities/Tanda"
import { db } from "../MySQLConnection"

export class MySQLTandaRepository implements TandaRepository {

  async findById(id: number): Promise<Tanda | null> {
    const [rows]: any = await db.query(
      "SELECT * FROM tandas WHERE id = ?",
      [id]
    )

    if (rows.length === 0) return null

    const row = rows[0]

    return new Tanda(
      row.id,
      row.name,
      row.contribution_amount,
      row.payment_frequency,
      row.total_members,
      row.delay_tolerance_days,
      row.penalty_per_day,
      row.status,
      row.creator_id,
      new Date(row.created_at)
    )
  }

  async save(tanda: Tanda): Promise<number> {
    const [result]: any = await db.query(
      `INSERT INTO tandas
     (name, contribution_amount, payment_frequency, total_members,
      delay_tolerance_days, penalty_per_day, status, creator_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tanda.name,
        tanda.contributionAmount,
        tanda.paymentFrequency,
        tanda.totalMembers,
        tanda.delayToleranceDays,
        tanda.penaltyPerDay,
        tanda.status,
        tanda.creatorId,
        tanda.createdAt
      ]
    )

    return result.insertId
  }

  async update(tanda: Tanda): Promise<void> {
    await db.query(
      `UPDATE tandas
       SET status = ?
       WHERE id = ?`,
      [tanda.status, tanda.id]
    )
  }

  async findAvailable(): Promise<Tanda[]> {
    const [rows]: any = await db.query(
      "SELECT * FROM tandas WHERE status = 'created'"
    )

    return rows.map((row: any) =>
      new Tanda(
        row.id,
        row.name,
        row.contribution_amount,
        row.payment_frequency,
        row.total_members,
        row.delay_tolerance_days,
        row.penalty_per_day,
        row.status,
        row.creator_id,
        new Date(row.created_at)
      )
    )
  }
}
