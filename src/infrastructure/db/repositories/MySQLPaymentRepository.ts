import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { PaymentEntity } from '../entities/PaymentEntity';
import { PaymentRepository } from '../../../domain/ports/PaymentRepository';
import { Payment } from '../../../domain/entities/Payment';

export class MySQLPaymentRepository implements PaymentRepository {
  private repository: Repository<PaymentEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(PaymentEntity);
  }

  async save(payment: Payment): Promise<void> {
    const existing = await this.repository.findOne({
      where: {
        participantId: payment.participantId,
        period: payment.period,
      }
    });

    if (existing) {
      await this.repository.update(existing.id, {
        status: payment.status,
        paymentDate: payment.paymentDate || undefined,
        penalty: payment.penalty,
      });
    } else {
      const paymentEntity = this.repository.create({
        participantId: payment.participantId,
        period: payment.period,
        amount: payment.amount,
        status: payment.status,
        dueDate: payment.dueDate,
        paymentDate: payment.paymentDate || undefined,
        penalty: payment.penalty,
      });
      
      await this.repository.save(paymentEntity);
    }
  }

  async findByParticipant(participantId: number): Promise<Payment[]> {
    const payments = await this.repository.find({ 
      where: { participantId } 
    });
    
    return payments.map(p => this.toDomain(p));
  }

  async findPendingByPeriod(tandaId: number, period: number): Promise<Payment[]> {
    const payments = await this.repository
      .createQueryBuilder('payment')
      .innerJoin('payment.participant', 'participant')
      .where('participant.tandaId = :tandaId', { tandaId })
      .andWhere('payment.period = :period', { period })
      .andWhere('payment.status = :status', { status: 'pending' })
      .getMany();
    
    return payments.map(p => this.toDomain(p));
  }

  private toDomain(entity: PaymentEntity): Payment {
    return new Payment(
      entity.id,
      entity.participantId,
      entity.period,
      Number(entity.amount),
      entity.status,
      entity.dueDate,
      entity.paymentDate || null,
      entity.penalty
    );
  }
}