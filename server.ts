import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { AppRouter } from './src/infrastructure/http/routes'
import { AppDataSource } from './src/infrastructure/db/data-source'
import { SocketService } from './src/infrastructure/socket/SocketService'
import { JobScheduler } from './src/infrastructure/cron/JobScheduler'

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 3000

app.use(cors())
app.use((req, res, next) => {
  if (req.originalUrl.includes('/payments/webhook')) {
    next()
  } else {
    express.json()(req, res, next)
  }
})
app.use(AppRouter)

SocketService.init(httpServer)

AppDataSource.initialize()
  .then(() => {
    JobScheduler.start()

    httpServer.listen(PORT, () => {})
  })
  .catch((error) => {
    process.exit(1)
  })