export type TandaStatusDTO =
  | "CREATED"
  | "IN_PROGRESS"
  | "FINISHED"

export interface TandaResponseDTO {
  id: number
  name: string
  contributionAmount: number
  totalMembers: number
  currentMembers: number
  status: TandaStatusDTO
  isMember: boolean
}
