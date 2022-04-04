import { SingleGame } from './SingleGame';

export class SessionState {
    gameHistory: SingleGame[] | undefined;
    active: boolean;
    startTime: Date;
    hardMode: boolean;
    gameTimerLength: number | undefined;
    maxGuesses: number;
}