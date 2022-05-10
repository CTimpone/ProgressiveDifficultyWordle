import { SingleGame } from './SingleGame';

export class SessionState {
    gameHistory: SingleGame[];
    active: boolean;
    startTime: Date;
    hardMode: boolean;
    gameTimerLimitExists: boolean;
    gameTimerLength: number | undefined;
    maxGuesses: number;

    constructor(hardMode: boolean, maxGuesses?: number, timerEnabled?: boolean,
        timerLength?: number) {
        this.gameHistory = [];
        this.active = true;
        this.startTime = new Date();

        if (timerEnabled === true) {
            this.gameTimerLimitExists = true;
            this.gameTimerLength = timerLength;
        }

        if (maxGuesses !== undefined) {
            this.maxGuesses = maxGuesses;
        }

        this.hardMode = hardMode;
    }

    getHarder(roundsCompleted: number): void {
        switch (roundsCompleted) {
            case 3:
                this.gameTimerLimitExists = true;
                this.gameTimerLength = 600;
                break;
            case 5:
            case 7:
            case 11:
            case 13:
            case 17:
                this.gameTimerLength -= 60;
                break;
            case 19:
            case 21:
            case 23:
            case 25:
            case 27:
            case 29:
                this.gameTimerLength -= 30;
                break;
            case 9:
            case 15:
            case 30:
                this.maxGuesses -= 1;
                break;
            default:
                console.log("No difficulty increase.")
                break;
        }
    }
}