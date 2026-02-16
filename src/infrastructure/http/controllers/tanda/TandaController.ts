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
    try {
      const tanda = await this.createTandaUseCase.execute({
        ...req.body,
        creatorId: req.user!.userId
      })
      res.status(201).json(tanda)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const tanda = await this.getTandaByIdUseCase.execute(
        Number(req.params.id),
        req.user!.userId
      )
      res.status(200).json(tanda)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }

  async join(req: Request, res: Response) {
    try {
      await this.joinTandaUseCase.execute(
        Number(req.params.id),
        req.user!.userId
      )
      res.status(200).json({ message: "Te uniste a la tanda" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async members(req: Request, res: Response) {
    try {
      const members = await this.getMembersUseCase.execute(
        Number(req.params.id)
      )
      res.status(200).json(members)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      await this.updateStatusUseCase.execute(
        Number(req.params.id),
        req.user!.userId,
        req.body.status
      )
      res.status(200).json({ message: "Estado actualizado" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async start(req: Request, res: Response) {
    try {
      await this.startTandaUseCase.execute(
        Number(req.params.id),
        req.user!.userId
      )
      res.status(200).json({ message: "Tanda iniciada" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async finish(req: Request, res: Response) {
    try {
      await this.finishTandaUseCase.execute(
        Number(req.params.id)
      )
      res.status(200).json({ message: "Tanda finalizada" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async close(req: Request, res: Response) {
    try {
      await this.closeTandaUseCase.execute(
        Number(req.params.id)
      )
      res.status(200).json({ message: "Tanda cerrada" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async generateSchedule(req: Request, res: Response) {
    try {
      const schedule = await this.generateScheduleUseCase.execute(
        Number(req.params.id)
      )
      res.status(200).json({
        message: "Horario generado exitosamente",
        data: schedule
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await this.getSummaryUseCase.execute(
        Number(req.params.id)
      )
      res.status(200).json(summary)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }

  async getAvailable(req: Request, res: Response) {
    try {
      const tandas = await this.getAvailableTandasUseCase.execute()
      res.status(200).json(tandas)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async leave(req: Request, res: Response) {
    try {
      await this.leaveTandaUseCase.execute(
        Number(req.params.id),
        req.user!.userId
      )
      res.status(200).json({ message: "Saliste de la tanda" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deleteTandaUseCase.execute(
        Number(req.params.id),
        req.user!.userId
      )
      res.status(200).json({ message: "Tanda eliminada exitosamente" })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}