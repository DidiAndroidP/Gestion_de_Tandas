export interface ScheduleResponse {
  tandaId: number
  sorteoFecha: Date
  metodo: string
  turnosAsignados: Array<{
    participanteId: number
    numeroTurno: number
    fechaCobro: string
    montoRecibir: number
    estado: string
  }>
  resumen: {
    totalPeriodos: number
    montoPorPeriodo: number
    montoTotalPorParticipante: number
    fechaFinalizacionEstimada: string
  }
}