export class ResultHistory {
    totalRounds: number;
    failedRounds: number;
    consecutiveWins: number;
    successfulRounds: number;
    guessMap: Map<number, number>;

    constructor() {
        this.totalRounds = 0;
        this.failedRounds = 0;
        this.successfulRounds = 0;
        this.consecutiveWins = 0;
        this.guessMap = new Map<number, number>();
    }
}