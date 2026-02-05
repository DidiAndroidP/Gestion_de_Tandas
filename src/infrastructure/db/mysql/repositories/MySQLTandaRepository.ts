import { TandaRepository } from "../../../../domain/ports/TandaRepository"
import { Tanda } from "../../../../domain/entities/Tanda"
import { db } from "../MySQLConnection"

export class MySQLTandaRepository implements TandaRepository {

  async save(tanda: Tanda): Promise<Tanda> {
    const [result]: any = await db.execute(
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
    return new Tanda(
        result.insertId, 
        tanda.name,
        tanda.contributionAmount,
        tanda.paymentFrequency,
        tanda.totalMembers,
        tanda.delayToleranceDays,
        tanda.penaltyPerDay,
        tanda.status,
        tanda.creatorId,
        tanda.createdAt
    );
  }

  async update(tanda: Tanda): Promise<void> {
    await db.execute(
      `UPDATE tandas SET status = ? WHERE id = ?`,
      [tanda.status, tanda.id]
    )
  }

  async findById(id: number): Promise<Tanda | null> {
    const [rows]: any = await db.execute(
      `SELECT * FROM tandas WHERE id = ?`,
      [id]
    )

    if (rows.length === 0) return null

    const t = rows[0]
    return new Tanda(
      t.id,
      t.name,
      t.contribution_amount,
      t.payment_frequency,
      t.total_members,
      t.delay_tolerance_days,
      t.penalty_per_day,
      t.status,
      t.creator_id,
      t.created_at
    )
  }

  async findByCreadorId(creadorId: number): Promise<Tanda[]> {
    const [rows]: any = await db.execute(
      `SELECT * FROM tandas WHERE creator_id = ?`,
      [creadorId]
    )

    return rows.map((t: any) =>
      new Tanda(
        t.id,
        t.name,
        t.contribution_amount,
        t.payment_frequency,
        t.total_members,
        t.delay_tolerance_days,
        t.penalty_per_day,
        t.status,
        t.creator_id,
        t.created_at
      )
    )
  }
}