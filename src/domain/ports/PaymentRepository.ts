import { Payment } from '../entities/Payment'

export interface PaymentRepository {
  save(payment: Payment): Promise<void>
  findById(id: number): Promise<Payment | null>
  findByParticipant(participantId: number): Promise<Payment[]>
  findPendingByPeriod(tandaId: number, periodo: number): Promise<Payment[]>
  findPendingByDate(date: Date): Promise<Payment[]>
}