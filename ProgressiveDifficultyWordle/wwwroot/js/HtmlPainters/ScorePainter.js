"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScorePainter = void 0;
const DOMConstants_1 = require("../Constants/DOMConstants");
const GameType_1 = require("../Models/GameType");
class ScorePainter {
    constructor(data) {
        this.scoreData = data;
    }
    paintScores(type) {
        if (type === GameType_1.GameType.Single) {
            this.paintSingle(this.scoreData.singleHistory);
        }
    }
    storeScoreData(data) {
        this.scoreData = data;
    }
    swapToScoreSection() {
        if ($("#scoreContainer").hasClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME)) {
            $("#scoreHistorySelector").trigger("click");
        }
    }
    paintSingle(history) {
        $("#singleScoreHistory").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        $("#endlessScoreHistory, #scalingScoreHistory").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        $("#singleRoundsPlayedText").text(history.totalRounds);
        $("#successfulRoundsText").text(history.successfulRounds);
        $("#failedRoundsText").text(history.failedRounds);
        $("#streakText").text(history.consecutiveWins);
        const barMaxWidth = $(".guessCountBarContainer").width();
        for (let i = 1; i <= 6; i++) {
            const incidenceCount = history.guessMap.has(i) ? history.guessMap.get(i) : 0;
            const calculatedPercentMod = (((incidenceCount / history.successfulRounds) * (barMaxWidth - 35) / barMaxWidth) * 100).toFixed(2);
            $(`#${i}guessCountBar`).width(`calc(${calculatedPercentMod}% + 35px`).text(incidenceCount);
        }
    }
    paintHighScores(type, scores) {
        throw new Error("Method not implemented.");
    }
}
exports.ScorePainter = ScorePainter;
//# sourceMappingURL=ScorePainter.js.map