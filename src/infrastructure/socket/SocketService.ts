import { Server as SocketIOServer } from "socket.io"
import { Server as HTTPServer } from "http"

export class SocketService {
  private static io: SocketIOServer

  private static activeSorteos = new Map<number, { endTime: number }>();

  static init(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: { origin: "*" }
    })

    this.io.on("connection", (socket) => {
      socket.on("joinTanda", (tandaId) => {
        socket.join(`tanda_${tandaId}`)

        const sorteo = this.activeSorteos.get(Number(tandaId));
        if (sorteo) {
          const segundosRestantes = Math.floor((sorteo.endTime - Date.now()) / 1000);
          if (segundosRestantes > 0) {
            socket.emit("sorteoIniciado", { countdown: segundosRestantes });
          }
        }
      })
    })
  }

  static emitToTanda(tandaId: number, event: string, data: any) {
    if (this.io) {
      this.io.to(`tanda_${tandaId}`).emit(event, data)
    }
  }

  static startCountdown(tandaId: number, seconds: number) {
    this.activeSorteos.set(tandaId, { endTime: Date.now() + (seconds * 1000) });
    this.emitToTanda(tandaId, "sorteoIniciado", { countdown: seconds });
  }

  static clearCountdown(tandaId: number) {
    this.activeSorteos.delete(tandaId);
  }
}