"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighScore = void 0;
class HighScore {
    constructor(details) {
        this.score = details.totalScore;
        this.roundsCompleted = details.roundsCompleted;
        this.date = details.endTime;
    }
}
exports.HighScore = HighScore;
//# sourceMappingURL=HighScore.js.map