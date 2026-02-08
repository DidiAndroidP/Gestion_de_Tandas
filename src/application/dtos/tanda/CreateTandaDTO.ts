export interface CreateTandaDTO {
  name: string
  contributionAmount: number
  paymentFrequency: string
  totalMembers: number
  delayToleranceDays: number
  penaltyPerDay: number
}
