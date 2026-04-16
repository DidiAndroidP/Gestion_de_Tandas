import { Server as SocketIOServer } from "socket.io"
import { Server as HTTPServer } from "http"

export class SocketService {
  private static io: SocketIOServer

  static init(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: { origin: "*" }
    })

    this.io.on("connection", (socket) => {
      socket.on("joinTanda", (tandaId) => {
        socket.join(`tanda_${tandaId}`)
      })
    })
  }

  static emitToTanda(tandaId: number, event: string, data: any) {
    if (this.io) {
      this.io.to(`tanda_${tandaId}`).emit(event, data)
    }
  }
}