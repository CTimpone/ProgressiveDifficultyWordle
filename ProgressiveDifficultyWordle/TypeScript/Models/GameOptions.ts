export class GameOptions {
    hardMode: boolean;
    maxGuesses: number;
    maxTimeLimitExists: boolean;
    maxTimeLimit: number;

    constructor(hardMode = false, maxGuesses = 6, maxTimeLimitExists = false, maxTimeLimit = 600) {
        this.hardMode = hardMode;
        this.maxGuesses = maxGuesses;
        this.maxTimeLimitExists = maxTimeLimitExists;
        this.maxTimeLimit = maxTimeLimit;
    }
}