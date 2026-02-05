import { PaymentFrequency } from "../../../domain/entities/Tanda"

export interface CreateTandaDTO {
  name: string
  contributionAmount: number
  paymentFrequency: PaymentFrequency
  totalMembers: number
  delayToleranceDays: number
  penaltyPerDay: number
  creatorId: number
}
