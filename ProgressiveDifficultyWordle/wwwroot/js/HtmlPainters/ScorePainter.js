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
        else if (type === GameType_1.GameType.Endless) {
            this.paintHighScores(type, this.scoreData.endlessScores);
        }
        else {
            this.paintHighScores(type, this.scoreData.scalingScores);
        }
    }
    storeScoreData(data) {
        this.scoreData = data;
    }
    swapToScoreSection(type) {
        switch (type) {
            case GameType_1.GameType.Endless:
                $("#gameTypeScoreSelector2").prop("checked", true);
                break;
            case GameType_1.GameType.ProgressiveDifficulty:
                $("#gameTypeScoreSelector3").prop("checked", true);
                break;
            case GameType_1.GameType.Single:
            default:
                $("#gameTypeScoreSelector1").prop("checked", true);
                break;
        }
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
        const sectionElement = $(`#${type === GameType_1.GameType.Endless ? "endless" : "scaling"}ScoreHistory`);
        const tableBaseElement = $(sectionElement).find(".scoreBoard");
        if (scores.length === 0) {
            $(sectionElement).find("#noScoresWarning").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $(tableBaseElement).addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
        else {
            $(sectionElement).find("#noScoresWarning").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $(tableBaseElement).removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            for (let i = 0; i < 10; i++) {
                if (scores.length > i) {
                    $(tableBaseElement).find(`tr[row-index=${i}]`).removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                    $(tableBaseElement).find(`#scoreRounds${i}`).text(scores[i].roundsCompleted);
                    $(tableBaseElement).find(`#scorePoints${i}`).text(scores[i].score);
                    if (scores[i].date instanceof Date) {
                        $(tableBaseElement).find(`#scoreDate${i}`).text(scores[i].date.toISOString().slice(0, 10));
                    }
                    else {
                        $(tableBaseElement).find(`#scoreDate${i}`).text(scores[i].date.toString().slice(0, 10));
                    }
                }
                else {
                    $(tableBaseElement).find(`tr[row-index=${i}]`).addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                }
            }
        }
    }
}
exports.ScorePainter = ScorePainter;
//# sourceMappingURL=ScorePainter.js.map