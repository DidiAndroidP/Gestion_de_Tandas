import { Payment } from '../entities/Payment';

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findByParticipant(participantId: number): Promise<Payment[]>;
  findPendingByPeriod(tandaId: number, periodo: number): Promise<Payment[]>;
}
