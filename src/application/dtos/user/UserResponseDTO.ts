export interface UserResponseDTO {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  active: boolean
  createdAt: Date
}
