import { ParticipantRepository } from "../../../../domain/ports/ParticipantRepository";
import { Participant } from "../../../../domain/entities/Participant";
import { db } from "../MySQLConnection";

export class MySQLParticipantRepository implements ParticipantRepository {
  async save(participant: Participant): Promise<void> {
    await db.execute(
      `INSERT INTO participants (id, user_id, tanda_id, turn, already_paid, expelled, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       turn = VALUES(turn), already_paid = VALUES(already_paid), expelled = VALUES(expelled)`,
      [
        participant.id === 0 ? null : participant.id,
        participant.userId,
        participant.tandaId,
        participant.turn,
        participant.alreadyPaid,
        participant.expelled,
        participant.createdAt
      ]
    );
  }

  async findByUsuarioYTanda(userId: number, tandaId: number): Promise<Participant | null> {
    const [rows]: any = await db.execute(
      `SELECT * FROM participants WHERE user_id = ? AND tanda_id = ?`,
      [userId, tandaId]
    );

    if (rows.length === 0) return null;
    return this.mapRowToEntity(rows[0]);
  }

  async findByTanda(tandaId: number): Promise<Participant[]> {
    const [rows]: any = await db.execute(
      `SELECT * FROM participants WHERE tanda_id = ?`,
      [tandaId]
    );
    return rows.map((row: any) => this.mapRowToEntity(row));
  }

  private mapRowToEntity(row: any): Participant {
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
}