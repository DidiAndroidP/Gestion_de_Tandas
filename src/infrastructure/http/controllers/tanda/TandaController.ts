import { Request, Response } from "express";
import { CreateTandaUseCase } from "../../../../application/use-cases/tanda/CreateTandaUseCase";
import { GetTandaByIdUseCase } from "../../../../application/use-cases/tanda/GetTandaByIdUseCase";
import { JoinTandaUseCase } from "../../../../application/use-cases/tanda/JoinTandaUseCase";
import { StartTandaUseCase } from "../../../../application/use-cases/tanda/StartTandaUseCase";
import { FinishTandaUseCase } from "../../../../application/use-cases/tanda/FinishTandaUseCase";
import { CloseTandaUseCase } from "../../../../application/use-cases/tanda/CloseTandaUseCase";
import { GenerateTandaScheduleUseCase } from "../../../../application/use-cases/tanda/GenerateTandaScheduleUseCase";
import { GetTandaSummaryUseCase } from "../../../../application/use-cases/tanda/GetTandaSummaryUseCase";
import { GetAvailableTandasUseCase } from "../../../../application/use-cases/tanda/GetAvailableTandasUseCase";
import { LeaveTandaUseCase } from "../../../../application/use-cases/tanda/LeaveTandaUseCase";

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
    private readonly leaveTandaUseCase: LeaveTandaUseCase
  ) {}

  async create(req: Request, res: Response) {
    const dto = { ...req.body, creatorId: req.user!.userId };
    const tanda = await this.createTandaUseCase.execute(dto);
    res.status(201).json(tanda);
  }

  async getAvailable(req: Request, res: Response) {
    const tandas = await this.getAvailableTandasUseCase.execute();
    res.status(200).json(tandas);
  }

  async leave(req: Request, res: Response) {
    const tandaId = Number(req.params.id);
    const userId = req.user!.userId;

    await this.leaveTandaUseCase.execute(userId, tandaId);

    res.status(200).json({
      message: "Saliste correctamente de la tanda"
    });
  }

  async join(req: Request, res: Response) {
    const tandaId = Number(req.params.id);
    const userId = req.user!.userId;

    await this.joinTandaUseCase.execute(tandaId, userId);

    res.status(200).json({ message: "Te uniste a la tanda" });
  }

  async getById(req: Request, res: Response) {
    const tanda = await this.getTandaByIdUseCase.execute(Number(req.params.id));
    res.status(200).json(tanda);
  }

  async start(req: Request, res: Response) {
    await this.startTandaUseCase.execute(
      Number(req.params.id),
      req.user!.userId
    );

    res.status(200).json({ message: "Tanda iniciada" });
  }

  async finish(req: Request, res: Response) {
    await this.finishTandaUseCase.execute(Number(req.params.id));
    res.status(200).json({ message: "Tanda finalizada" });
  }

  async close(req: Request, res: Response) {
    await this.closeTandaUseCase.execute(Number(req.params.id));
    res.status(200).json({ message: "Tanda cerrada" });
  }

  async generateSchedule(req: Request, res: Response) {
    await this.generateScheduleUseCase.execute(Number(req.params.id));
    res.status(200).json({ message: "Calendario generado" });
  }

  async getSummary(req: Request, res: Response) {
    const summary = await this.getSummaryUseCase.execute(
      Number(req.params.id)
    );
    res.status(200).json(summary);
  }
}