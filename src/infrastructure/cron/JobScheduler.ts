import cron from 'node-cron'
import { notifyUpcomingPaymentsUseCase } from '../http/dependencies'

export class JobScheduler {
  static start() {
    cron.schedule('0 8 * * *', async () => {
      await notifyUpcomingPaymentsUseCase.execute()
    })
  }
}