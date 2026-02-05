import { TandaRepository } from "../../../../domain/ports/TandaRepository"
import { Tanda } from "../../../../domain/entities/Tanda"
import { db } from "../MySQLConnection"

export class MySQLTandaRepository implements TandaRepository {

  async save(tanda: Tanda): Promise<Tanda> {
    const [result]: any = await db.execute(
      `INSERT INTO tandas
      (name, contribution_amount, payment_frequency, total_members,
       delay_tolerance_days, penalty_per_day, status, creator_id, created_at, start_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        tanda.name,
        tanda.contributionAmount,
        tanda.paymentFrequency,
        tanda.totalMembers,
        tanda.delayToleranceDays,
        tanda.penaltyPerDay,
        tanda.status,
        tanda.creatorId,
        tanda.createdAt,
        tanda.startDate 
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
        tanda.createdAt,
        tanda.startDate, 
        []
    );
  }

  async update(tanda: Tanda): Promise<void> {
    await db.execute(
      `UPDATE tandas SET status = ?, start_date = ? WHERE id = ?`,
      [tanda.status, tanda.startDate, tanda.id]
    )
  }

  async findById(id: number): Promise<Tanda | null> {
    const [rows]: any = await db.execute(
      `SELECT * FROM tandas WHERE id = ?`,
      [id]
    )

    if (rows.length === 0) return null
    const t = rows[0]

    const [partRows]: any = await db.execute(
        `SELECT user_id FROM participants WHERE tanda_id = ?`,
        [id]
    )
    const participantIds = partRows.map((p: any) => p.user_id)

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
      t.created_at,
      t.start_date, 
      participantIds
    )
  }

  async findByCreatorId(creatorId: number): Promise<Tanda[]> {
    const [rows]: any = await db.execute(
      `SELECT * FROM tandas WHERE creator_id = ?`,
      [creatorId]
    )

    const tandas: Tanda[] = []

    for (const t of rows) {
        const [partRows]: any = await db.execute(
            `SELECT user_id FROM participants WHERE tanda_id = ?`,
            [t.id]
        )
        const participantIds = partRows.map((p: any) => p.user_id)

        tandas.push(new Tanda(
            t.id,
            t.name,
            t.contribution_amount,
            t.payment_frequency,
            t.total_members,
            t.delay_tolerance_days,
            t.penalty_per_day,
            t.status,
            t.creator_id,
            t.created_at,
            t.start_date, 
            participantIds
        ))
    }

    return tandas
  }
}