import { SingleGame } from "./SingleGame";

export class ScoreDetails {
    totalScore: number;
    roundsCompleted: number;
    endTime: Date | undefined;
    startingGuesses: Set<string>;

    static readonly ROUND_SCORE_GUESS_MULTIPLIERS = [2, 1.5, 1.25, 1, 0.8, 0.5];

    constructor() {
        this.totalScore = 0;
        this.roundsCompleted = 0;
        this.startingGuesses = new Set<string>();
    }

    updateScore(game: SingleGame): void {
        if (this.endTime === undefined) {
            let guessCount = game.userGuesses.length;
            let roundScore = 0;

            if (guessCount > 0) {
                let lastGuess = game.userGuesses[guessCount - 1];

                roundScore = lastGuess.fullMatch ? 1000 : 0;

                roundScore += 500 * ScoreDetails.ROUND_SCORE_GUESS_MULTIPLIERS[guessCount - 1];

                let timeElapsedMinutes = Math.floor((game.endTime.getTime() - game.startTime.getTime()) / 60000);

                if (timeElapsedMinutes <= 4) {
                    roundScore = (roundScore * 2) / Math.sqrt(timeElapsedMinutes);
                }

                if (this.startingGuesses.has(game.userGuesses[0].guess)) {
                    roundScore *= 0.75;
                } else {
                    this.startingGuesses.add(game.userGuesses[0].guess);
                }
            }

            if (roundScore === 0) {
                this.endTime = game.endTime;
            }
            else {
                this.totalScore += roundScore;
                this.roundsCompleted += 1;
                this.totalScore = this.totalScore * (Math.log(100 + this.roundsCompleted) / Math.log(100));
            }
        }
    }
}