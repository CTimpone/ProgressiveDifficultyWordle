"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultHistory = void 0;
class ResultHistory {
    constructor() {
        this.totalRounds = 0;
        this.failedRounds = 0;
        this.successfulRounds = 0;
        this.consecutiveWins = 0;
        this.guessMap = new Map();
    }
}
exports.ResultHistory = ResultHistory;
//# sourceMappingURL=ResultHistory.js.map