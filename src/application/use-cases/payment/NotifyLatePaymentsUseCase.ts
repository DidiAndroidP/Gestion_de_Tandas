import { PaymentRepository } from "../../../domain/ports/PaymentRepository"
import { TandaRepository } from "../../../domain/ports/TandaRepository"

export class NotifyLatePaymentsUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly tandaRepository: TandaRepository
  ) {}

  async execute(tandaId: number, period: number): Promise<number> {
    const tanda = await this.tandaRepository.findById(tandaId)
    if (!tanda) throw new Error("Tanda not found")

    const pendingPayments =
      await this.paymentRepository.findPendingByPeriod(tandaId, period)
    return pendingPayments.length
  }
}
