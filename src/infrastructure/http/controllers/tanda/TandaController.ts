import { Request, Response } from "express";
import { CreateTandaUseCase } from "../../../../application/use-cases/tanda/CreateTandaUseCase";
import { GetTandaByIdUseCase } from "../../../../application/use-cases/tanda/GetTandaByIdUseCase";
import { JoinTandaUseCase } from "../../../../application/use-cases/tanda/JoinTandaUseCase";
import { StartTandaUseCase } from "../../../../application/use-cases/tanda/StartTandaUseCase";
import { FinishTandaUseCase } from "../../../../application/use-cases/tanda/FinishTandaUseCase";
import { CloseTandaUseCase } from "../../../../application/use-cases/tanda/CloseTandaUseCase";
import { GenerateTandaScheduleUseCase } from "../../../../application/use-cases/tanda/GenerateTandaScheduleUseCase";
import { GetTandaSummaryUseCase } from "../../../../application/use-cases/tanda/GetTandaSummaryUseCase";

export class TandaController {
  constructor(
    private readonly createTandaUseCase: CreateTandaUseCase,
    private readonly getTandaByIdUseCase: GetTandaByIdUseCase,
    private readonly joinTandaUseCase: JoinTandaUseCase,
    private readonly startTandaUseCase: StartTandaUseCase,
    private readonly finishTandaUseCase: FinishTandaUseCase,
    private readonly closeTandaUseCase: CloseTandaUseCase,
    private readonly generateScheduleUseCase: GenerateTandaScheduleUseCase,
    private readonly getSummaryUseCase: GetTandaSummaryUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const dto = { ...req.body, creatorId: req.user!.userId };
      const tanda = await this.createTandaUseCase.execute(dto);
      res.status(201).json(tanda);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const tanda = await this.getTandaByIdUseCase.execute(Number(req.params.id));
      res.status(200).json(tanda);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async join(req: Request, res: Response) {
    try {
      const tandaId = req.body.tandaId;
      await this.joinTandaUseCase.execute(tandaId, req.user!.userId);
      res.status(200).json({ message: "Joined tanda successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async start(req: Request, res: Response) {
    try {
      await this.startTandaUseCase.execute(Number(req.params.id));
      res.status(200).json({ message: "Tanda started" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async finish(req: Request, res: Response) {
    try {
      await this.finishTandaUseCase.execute(Number(req.params.id));
      res.status(200).json({ message: "Tanda finished" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async close(req: Request, res: Response) {
    try {
      await this.closeTandaUseCase.execute(Number(req.params.id));
      res.status(200).json({ message: "Tanda closed" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async generateSchedule(req: Request, res: Response) {
    try {
      await this.generateScheduleUseCase.execute(Number(req.params.id));
      res.status(200).json({ message: "Schedule generated" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await this.getSummaryUseCase.execute(Number(req.params.id));
      res.status(200).json(summary);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}