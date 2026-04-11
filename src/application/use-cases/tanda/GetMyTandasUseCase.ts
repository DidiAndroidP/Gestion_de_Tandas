import { Tanda } from "../../../domain/entities/Tanda";
import { TandaRepository } from "../../../domain/ports/TandaRepository";

export class GetMyTandasUseCase {
  constructor(private readonly tandaRepository: TandaRepository) {}

  async execute(userId: number): Promise<Tanda[]> {
    return await this.tandaRepository.findByUserId(userId);
  }
}