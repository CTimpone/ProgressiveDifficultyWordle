import { domConstants } from "../Constants/DOMConstants";
import { ScorePainterInterface } from "../Interfaces/ScorePainterInterface";
import { GameType } from "../Models/GameType";
import { HighScore } from "../Models/Scoring/HighScore";
import { ResultHistory } from "../Models/Scoring/ResultHistory";
import { ScoreWrapper } from "../Models/Scoring/ScoreWrapper";

export class ScorePainter implements ScorePainterInterface {
    private scoreData: ScoreWrapper;

    constructor(data: ScoreWrapper) {
        this.scoreData = data;
    }

    paintScores(type: GameType): void {
        if (type === GameType.Single) {
            this.paintSingle(this.scoreData.singleHistory);
        }
    }

    storeScoreData(data: ScoreWrapper): void {
        this.scoreData = data;
    }

    swapToScoreSection(): void {
        if ($("#scoreContainer").hasClass(domConstants.HIDDEN_CLASS_NAME)) {
            $("#scoreHistorySelector").trigger("click");
        }
    }

    private paintSingle(history: ResultHistory): void {
        $("#singleScoreHistory").removeClass(domConstants.HIDDEN_CLASS_NAME);
        $("#endlessScoreHistory, #scalingScoreHistory").addClass(domConstants.HIDDEN_CLASS_NAME);

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

    paintHighScores(type: GameType, scores: HighScore[]): void {
        throw new Error("Method not implemented.");
    }
}