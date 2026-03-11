import { Participant } from '../entities/Participant';

export interface ScheduleAssignment {
  participantId: number;
  turnNumber: number;
  collectionDate: Date;
}

export interface TandaScheduleResult {
  assignments: ScheduleAssignment[];
  startDate: Date;
  endDate: Date;
  paymentAmount: number;
}

export class TurnService {
  generateRandomSchedule(
    participants: Participant[],
    startDate: Date,
    paymentFrequency: string,
    totalAmount: number
  ): TandaScheduleResult {
    if (participants.length === 0) {
      throw new Error('No hay participantes para generar el horario');
    }

    const participantCount = participants.length;
    const paymentAmount = totalAmount / participantCount;

    const availableTurns = Array.from(
      { length: participantCount },
      (_, i) => i + 1
    );

    this.shuffleArray(availableTurns);

    const assignments: ScheduleAssignment[] = participants.map(
      (participant, index) => {
        const turnNumber = availableTurns[index];
        const collectionDate = this.calculateCollectionDate(
          startDate,
          turnNumber,
          paymentFrequency
        );
        return { participantId: participant.id, turnNumber, collectionDate };
      }
    );

    assignments.sort((a, b) => a.turnNumber - b.turnNumber);

    const endDate = this.calculateCollectionDate(
      startDate,
      participantCount,
      paymentFrequency
    );

    return { assignments, startDate, endDate, paymentAmount };
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private calculateCollectionDate(
    startDate: Date,
    turnNumber: number,
    paymentFrequency: string
  ): Date {
    const date = new Date(startDate);
    const periodsToAdd = turnNumber - 1;

    switch (paymentFrequency.toLowerCase()) {
      case 'mensual':
        date.setMonth(date.getMonth() + periodsToAdd);
        break;
      case 'quincenal':
        date.setDate(date.getDate() + periodsToAdd * 15);
        break;
      case 'semanal':
        date.setDate(date.getDate() + periodsToAdd * 7);
        break;
      default:
        date.setMonth(date.getMonth() + periodsToAdd);
    }

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) {
      date.setDate(date.getDate() + 2); 
    } else if (dayOfWeek === 0) {
      date.setDate(date.getDate() + 1); 
    }

    return date;
  }

  assignTurn(participants: Participant[]): number {
    if (participants.length === 0) return 1;
    const turns = participants.map((p) => p.turn);
    return Math.max(...turns) + 1;
  }
}