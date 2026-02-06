import { ParticipantRepository } from "../../../../domain/ports/ParticipantRepository";
import { Participant } from "../../../../domain/entities/Participant";
import { db } from "../MySQLConnection";

export class MySQLParticipantRepository implements ParticipantRepository {

  async save(participant: Participant): Promise<void> {
    await db.execute(
      `INSERT INTO participants 
      (user_id, tanda_id, turn, already_paid, expelled, created_at)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        participant.userId,
        participant.tandaId,
        participant.turn,
        participant.alreadyPaid,
        participant.expelled,
        participant.createdAt
      ]
    );
  }

  async findByUserAndTanda(
    userId: number,
    tandaId: number
  ): Promise<Participant | null> {

    const [rows]: any = await db.execute(
      `SELECT * FROM participants WHERE user_id = ? AND tanda_id = ?`,
      [userId, tandaId]
    );

    if (rows.length === 0) return null;

    const row = rows[0];

    return new Participant(
      row.id,
      row.user_id,
      row.tanda_id,
      row.turn,
      Boolean(row.already_paid),
      Boolean(row.expelled),
      row.created_at
    );
  }

  async findByTanda(tandaId: number): Promise<Participant[]> {
    const [rows]: any = await db.execute(
      `SELECT * FROM participants WHERE tanda_id = ?`,
      [tandaId]
    );

    return rows.map((row: any) =>
      new Participant(
        row.id,
        row.user_id,
        row.tanda_id,
        row.turn,
        Boolean(row.already_paid),
        Boolean(row.expelled),
        row.created_at
      )
    );
  }

  async delete(userId: number, tandaId: number): Promise<void> {
    await db.execute(
      `DELETE FROM participants WHERE user_id = ? AND tanda_id = ?`,
      [userId, tandaId]
    );
  }
}
