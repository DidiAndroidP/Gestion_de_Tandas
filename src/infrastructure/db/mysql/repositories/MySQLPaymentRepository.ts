import { PaymentRepository } from "../../../../domain/ports/PaymentRepository";
import { Payment } from "../../../../domain/entities/Payment";
import { db } from "../MySQLConnection";

export class MySQLPaymentRepository implements PaymentRepository {
  async save(payment: Payment): Promise<void> {
    await db.execute(
      `INSERT INTO payments (participant_id, period, amount, status, due_date, payment_date, penalty)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       status = VALUES(status), payment_date = VALUES(payment_date), penalty = VALUES(penalty)`,
      [
        payment.participantId,
        payment.period,
        payment.amount,
        payment.status,
        payment.dueDate,
        payment.paymentDate,
        payment.penalty
      ]
    );
  }

  async findByParticipant(participantId: number): Promise<Payment[]> {
    const [rows]: any = await db.execute(
      `SELECT * FROM payments WHERE participant_id = ?`,
      [participantId]
    );
    return rows.map((row: any) => this.mapRowToEntity(row));
  }

  async findPendingByPeriod(tandaId: number, period: number): Promise<Payment[]> {
    const query = `
      SELECT p.* FROM payments p
      INNER JOIN participants par ON p.participant_id = par.id
      WHERE par.tanda_id = ? AND p.period = ? AND p.status = 'pending'
    `;
    const [rows]: any = await db.execute(query, [tandaId, period]);
    return rows.map((row: any) => this.mapRowToEntity(row));
  }

  private mapRowToEntity(row: any): Payment {
    return new Payment(
      row.id,
      row.participant_id,
      row.period,
      row.amount,
      row.status,
      row.due_date,
      row.payment_date,
      row.penalty
    );
  }
}