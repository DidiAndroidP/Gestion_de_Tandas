export interface TandaResponseDTO {
  id: number
  name: string
  contributionAmount: number
  totalMembers: number
  currentMembers: number
  status: "CREATED" | "IN_PROGRESS" | "FINISHED"
}
