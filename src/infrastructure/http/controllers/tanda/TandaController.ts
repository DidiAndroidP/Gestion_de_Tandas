import { Request, Response } from "express"
import { CreateTandaUseCase } from "../../../../application/use-cases/tanda/CreateTandaUseCase"
import { GetTandaByIdUseCase } from "../../../../application/use-cases/tanda/GetTandaByIdUseCase"
import { JoinTandaUseCase } from "../../../../application/use-cases/tanda/JoinTandaUseCase"
import { GetTandaMembersUseCase } from "../../../../application/use-cases/tanda/GetTandaMembersUseCase"
import { UpdateTandaStatusUseCase } from "../../../../application/use-cases/tanda/UpdateTandaStatusUseCase"
import { FinishTandaUseCase } from "../../../../application/use-cases/tanda/FinishTandaUseCase"
import { CloseTandaUseCase } from "../../../../application/use-cases/tanda/CloseTandaUseCase"
import { StartTandaUseCase } from "../../../../application/use-cases/tanda/StartTandaUseCase"
import { GenerateTandaScheduleUseCase } from "../../../../application/use-cases/tanda/GenerateTandaScheduleUseCase"
import { GetTandaSummaryUseCase } from "../../../../application/use-cases/tanda/GetTandaSummaryUseCase"
import { GetAvailableTandasUseCase } from "../../../../application/use-cases/tanda/GetAvailableTandasUseCase"
import { LeaveTandaUseCase } from "../../../../application/use-cases/tanda/LeaveTandaUseCase"
import { DeleteTandaUseCase } from "../../../../application/use-cases/tanda/DeleteTandaUseCase"
export class TandaController {
  constructor(
    private readonly createTandaUseCase: CreateTandaUseCase,
    private readonly getTandaByIdUseCase: GetTandaByIdUseCase,
    private readonly joinTandaUseCase: JoinTandaUseCase,
    private readonly startTandaUseCase: StartTandaUseCase,
    private readonly finishTandaUseCase: FinishTandaUseCase,
    private readonly closeTandaUseCase: CloseTandaUseCase,
    private readonly generateScheduleUseCase: GenerateTandaScheduleUseCase,
    private readonly getSummaryUseCase: GetTandaSummaryUseCase,
    private readonly getAvailableTandasUseCase: GetAvailableTandasUseCase,
    private readonly leaveTandaUseCase: LeaveTandaUseCase,
    private readonly getMembersUseCase: GetTandaMembersUseCase,
    private readonly updateStatusUseCase: UpdateTandaStatusUseCase,
    private readonly deleteTandaUseCase: DeleteTandaUseCase
  ) { }

  async create(req: Request, res: Response) {
    const tanda = await this.createTandaUseCase.execute({
      ...req.body,
      creatorId: req.user!.userId
    })
    res.status(201).json(tanda)
  }

  async getById(req: Request, res: Response) {
    const tanda = await this.getTandaByIdUseCase.execute(
      Number(req.params.id),
      req.user!.userId
    )
    res.status(200).json(tanda)
  }

  async join(req: Request, res: Response) {
    await this.joinTandaUseCase.execute(
      Number(req.params.id),
      req.user!.userId
    )
    res.status(200).json({ message: "Te uniste a la tanda" })
  }

  async members(req: Request, res: Response) {
    const members = await this.getMembersUseCase.execute(
      Number(req.params.id)
    )
    res.status(200).json(members)
  }

  async updateStatus(req: Request, res: Response) {
    await this.updateStatusUseCase.execute(
      Number(req.params.id),
      req.user!.userId,
      req.body.status
    )
    res.status(200).json({ message: "Estado actualizado" })
  }

  async start(req: Request, res: Response) {
    await this.startTandaUseCase.execute(
      Number(req.params.id),
      req.user!.userId
    )
    res.status(200).json({ message: "Tanda iniciada" })
  }

  async finish(req: Request, res: Response) {
    await this.finishTandaUseCase.execute(
      Number(req.params.id)
    )
    res.status(200).json({ message: "Tanda finalizada" })
  }

  async close(req: Request, res: Response) {
    await this.closeTandaUseCase.execute(
      Number(req.params.id)
    )
    res.status(200).json({ message: "Tanda cerrada" })
  }

  async generateSchedule(req: Request, res: Response) {
    await this.generateScheduleUseCase.execute(
      Number(req.params.id)
    )
    res.status(200).json({ message: "Calendario generado" })
  }

  async getSummary(req: Request, res: Response) {
    const summary = await this.getSummaryUseCase.execute(
      Number(req.params.id)
    )
    res.status(200).json(summary)
  }

  async getAvailable(req: Request, res: Response) {
    const tandas = await this.getAvailableTandasUseCase.execute()
    res.status(200).json(tandas)
  }

  async leave(req: Request, res: Response) {
    await this.leaveTandaUseCase.execute(
      req.user!.userId,
      Number(req.params.id)
    )
    res.status(200).json({ message: "Saliste de la tanda" })
  }

  async delete(req: Request, res: Response) {
    await this.deleteTandaUseCase.execute(
      Number(req.params.id),
      req.user!.userId
    )

    res.status(200).json({
      message: "Tanda eliminada correctamente"
    })
  }
}
