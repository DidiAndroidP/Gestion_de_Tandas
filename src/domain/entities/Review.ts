export class Review {
  constructor(
    public readonly id: number,
    public readonly reviewerId: number,
    public readonly creatorId: number,
    public readonly tandaId: number,
    public readonly score: number,
    public readonly comment: string,
    public readonly createdAt: Date
  ) {
    if (score < 1 || score > 5) {
      throw new Error("El puntaje debe estar entre 1 y 5 estrellas.")
    }
  }
}