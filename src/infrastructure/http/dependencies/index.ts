import { MySQLTandaRepository } from "../../db/mysql/repositories/MySQLTandaRepository"
import { MySQLUserRepository } from "../../db/mysql/repositories/MySQLUserRepository"
import { MySQLParticipantRepository } from "../../db/mysql/repositories/MySQLParticipantRepository"
import { MySQLPaymentRepository } from "../../db/mysql/repositories/MySQLPaymentRepository"
import { MySQLInvitationRepository } from "../../db/mysql/repositories/MySQLInvitationRepository"
import { BcryptJwtAuthRepository } from "../../auth/BcryptJwtAuthRepository"
import { TurnService } from "../../../domain/services/TurnService"
import { CreateUserUseCase } from "../../../application/use-cases/user/CreateUserUseCase"
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase"
import { GetUserByIdUseCase } from "../../../application/use-cases/user/GetUserByIdUseCase"
import { UpdateUserUseCase } from "../../../application/use-cases/user/UpdateUserUseCase"
import { ActivateUserUseCase } from "../../../application/use-cases/user/ActivateUserUseCase"
import { CreateTandaUseCase } from "../../../application/use-cases/tanda/CreateTandaUseCase"
import { GetTandaByIdUseCase } from "../../../application/use-cases/tanda/GetTandaByIdUseCase"
import { JoinTandaUseCase } from "../../../application/use-cases/tanda/JoinTandaUseCase"
import { StartTandaUseCase } from "../../../application/use-cases/tanda/StartTandaUseCase"
import { FinishTandaUseCase } from "../../../application/use-cases/tanda/FinishTandaUseCase"
import { CloseTandaUseCase } from "../../../application/use-cases/tanda/CloseTandaUseCase"
import { DeleteTandaUseCase } from "../../../application/use-cases/tanda/DeleteTandaUseCase"
import { GenerateTandaScheduleUseCase } from "../../../application/use-cases/tanda/GenerateTandaScheduleUseCase"
import { GetTandaSummaryUseCase } from "../../../application/use-cases/tanda/GetTandaSummaryUseCase"
import { GetAvailableTandasUseCase } from "../../../application/use-cases/tanda/GetAvailableTandasUseCase"
import { LeaveTandaUseCase } from "../../../application/use-cases/tanda/LeaveTandaUseCase"
import { GetTandaMembersUseCase } from "../../../application/use-cases/tanda/GetTandaMembersUseCase"
import { UpdateTandaStatusUseCase } from "../../../application/use-cases/tanda/UpdateTandaStatusUseCase"
import { CreateInvitationUseCase } from "../../../application/use-cases/invitation/CreateInvitationUseCase"
import { AcceptInvitationUseCase } from "../../../application/use-cases/invitation/AcceptInvitationUseCase"
import { RegisterPaymentUseCase } from "../../../application/use-cases/payment/RegisterPaymentUseCase"
import { NotifyLatePaymentsUseCase } from "../../../application/use-cases/payment/NotifyLatePaymentsUseCase"
import { AuthController } from "../controllers/auth/AuthController"
import { UserController } from "../controllers/user/UserController"
import { TandaController } from "../controllers/tanda/TandaController"
import { InvitationController } from "../controllers/invitation/InvitationController"
import { PaymentController } from "../controllers/payment/PaymentController"
import { createAuthMiddleware } from "../../middleware/AuthMiddleware"

const tandaRepo = new MySQLTandaRepository()
const userRepo = new MySQLUserRepository()
const participantRepo = new MySQLParticipantRepository()
const paymentRepo = new MySQLPaymentRepository()
const invitationRepo = new MySQLInvitationRepository()
const authRepo = new BcryptJwtAuthRepository()

const turnService = new TurnService()

export const authMiddleware = createAuthMiddleware(authRepo)

const createUserUseCase = new CreateUserUseCase(userRepo, authRepo)
const loginUseCase = new LoginUseCase(userRepo, authRepo)
const getUserByIdUseCase = new GetUserByIdUseCase(userRepo)
const updateUserUseCase = new UpdateUserUseCase(userRepo)
const activateUserUseCase = new ActivateUserUseCase(userRepo)

const createTandaUseCase = new CreateTandaUseCase(tandaRepo, participantRepo)
const getTandaByIdUseCase = new GetTandaByIdUseCase(tandaRepo, participantRepo)
const joinTandaUseCase = new JoinTandaUseCase(tandaRepo, participantRepo)
const startTandaUseCase = new StartTandaUseCase(tandaRepo, participantRepo)
const finishTandaUseCase = new FinishTandaUseCase(tandaRepo)
const closeTandaUseCase = new CloseTandaUseCase(tandaRepo)
const deleteTandaUseCase = new DeleteTandaUseCase(tandaRepo)

const generateScheduleUseCase = new GenerateTandaScheduleUseCase(
  participantRepo,
  tandaRepo,
  turnService
)

const getSummaryUseCase = new GetTandaSummaryUseCase(
  tandaRepo,
  participantRepo,
  paymentRepo
)

const getAvailableTandasUseCase = new GetAvailableTandasUseCase(tandaRepo)

const leaveTandaUseCase = new LeaveTandaUseCase(
  participantRepo,
  tandaRepo
)

const getTandaMembersUseCase = new GetTandaMembersUseCase(
  participantRepo,
  userRepo
)

const updateTandaStatusUseCase = new UpdateTandaStatusUseCase(
  tandaRepo
)

const createInvitationUseCase = new CreateInvitationUseCase(invitationRepo)
const acceptInvitationUseCase = new AcceptInvitationUseCase(
  invitationRepo,
  joinTandaUseCase
)

const registerPaymentUseCase = new RegisterPaymentUseCase(
  paymentRepo,
  participantRepo
)

const notifyLatePaymentsUseCase = new NotifyLatePaymentsUseCase(
  paymentRepo,
  tandaRepo
)

export const authController = new AuthController(
  createUserUseCase,
  loginUseCase
)

export const userController = new UserController(
  getUserByIdUseCase,
  updateUserUseCase,
  activateUserUseCase
)

export const tandaController = new TandaController(
  createTandaUseCase,
  getTandaByIdUseCase,
  joinTandaUseCase,
  startTandaUseCase,
  finishTandaUseCase,
  closeTandaUseCase,
  generateScheduleUseCase,
  getSummaryUseCase,
  getAvailableTandasUseCase,
  leaveTandaUseCase,
  getTandaMembersUseCase,
  updateTandaStatusUseCase,
  deleteTandaUseCase
)

export const invitationController = new InvitationController(
  createInvitationUseCase,
  acceptInvitationUseCase
)

export const paymentController = new PaymentController(
  registerPaymentUseCase,
  notifyLatePaymentsUseCase
)