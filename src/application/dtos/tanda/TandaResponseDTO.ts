export type TandaStatusDTO =
  | "CREATED"
  | "IN_PROGRESS"
  | "FINISHED"

export interface TandaResponseDTO {
  id: number
  name: string
  contributionAmount: number
  paymentFrequency: string
  totalMembers: number
  currentMembers: number
  status: TandaStatusDTO
  isMember: boolean
  creatorId: number
  isAdmin: boolean
}