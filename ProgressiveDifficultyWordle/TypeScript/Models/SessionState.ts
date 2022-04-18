import { SingleGame } from './SingleGame';

export class SessionState {
    gameHistory: SingleGame[];
    active: boolean;
    startTime: Date;
    hardMode: boolean;
    gameTimerLimitExists: boolean;
    gameTimerLength: number | undefined;
    maxGuesses: number;

    constructor(hardMode: boolean) {
        this.gameHistory = [];
        this.active = true;
        this.startTime = new Date();
        this.gameTimerLimitExists = false;
        this.hardMode = hardMode;
        this.maxGuesses = 6;
    }
}