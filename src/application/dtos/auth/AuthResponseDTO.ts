import { UserResponseDTO } from "../user/UserResponseDTO"

export interface AuthResponseDTO {
  token: string
  user: UserResponseDTO
}