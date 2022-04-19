"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreDetails = void 0;
class ScoreDetails {
    constructor() {
        this.totalScore = 0;
        this.roundsCompleted = 0;
        this.startingGuesses = new Set();
    }
    updateScore(game) {
        if (this.endTime === undefined) {
            const guessCount = game.userGuesses.length;
            let roundScore = 0;
            if (game.solved()) {
                const lastGuess = game.userGuesses[guessCount - 1];
                roundScore = lastGuess.fullMatch ? 1000 : 0;
                roundScore += 500 * ScoreDetails.ROUND_SCORE_GUESS_MULTIPLIERS[guessCount - 1];
                const timeElapsedMinutes = Math.floor((game.endTime.getTime() - game.startTime.getTime()) / 60000);
                if (timeElapsedMinutes <= 4) {
                    roundScore = (roundScore * 2) / Math.sqrt(timeElapsedMinutes);
                }
                if (this.startingGuesses.has(game.userGuesses[0].guess)) {
                    roundScore *= 0.75;
                }
                else {
                    this.startingGuesses.add(game.userGuesses[0].guess);
                }
                this.totalScore += roundScore;
                this.roundsCompleted += 1;
                this.totalScore = this.totalScore * (Math.log(100 + this.roundsCompleted) / Math.log(100));
            }
            else if (game.endTime !== undefined) {
                this.endTime = game.endTime;
            }
        }
        else {
            throw new Error("Cannot update score when not active.");
        }
    }
}
exports.ScoreDetails = ScoreDetails;
ScoreDetails.ROUND_SCORE_GUESS_MULTIPLIERS = [2, 1.5, 1.25, 1, 0.8, 0.5];
//# sourceMappingURL=scoredetails.js.map