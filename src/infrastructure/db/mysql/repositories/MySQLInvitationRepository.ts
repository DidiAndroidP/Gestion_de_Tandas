import { InvitationRepository } from "../../../../domain/ports/InvitationRepository";
import { Invitation } from "../../../../domain/entities/Invitation";
import { db } from "../MySQLConnection";

export class MySQLInvitationRepository implements InvitationRepository {
  async save(invitation: Invitation): Promise<void> {
    await db.execute(
      `INSERT INTO invitations (tanda_id, email, status, token) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [invitation.tandaId, invitation.email, invitation.status, invitation.token]
    );
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const [rows]: any = await db.execute(`SELECT * FROM invitations WHERE token = ?`, [token]);
    if (rows.length === 0) return null;
    
    const i = rows[0];
    return new Invitation(i.id, i.tanda_id, i.email, i.status, i.token);
  }
}