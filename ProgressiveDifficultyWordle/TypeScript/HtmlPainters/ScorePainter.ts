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
        } else if (type === GameType.Endless) {
            this.paintHighScores(type, this.scoreData.endlessScores);
        } else {
            this.paintHighScores(type, this.scoreData.scalingScores);
        }
    }

    storeScoreData(data: ScoreWrapper): void {
        this.scoreData = data;
    }

    swapToScoreSection(type?: GameType): void {
        switch (type) {
            case GameType.Endless:
                $("#gameTypeScoreSelector2").prop("checked", true);
                break;
            case GameType.ProgressiveDifficulty:
                $("#gameTypeScoreSelector3").prop("checked", true);
                break;
            case GameType.Single:
            default:
                $("#gameTypeScoreSelector1").prop("checked", true);
                break;
        }
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
        const sectionElement = $(`#${type === GameType.Endless ? "endless" : "scaling"}ScoreHistory`);
        const tableBaseElement = $(sectionElement).find(".scoreBoard");

        if (scores.length === 0) {
            $(sectionElement).find("#noScoresWarning").removeClass(domConstants.HIDDEN_CLASS_NAME);
            $(tableBaseElement).addClass(domConstants.HIDDEN_CLASS_NAME);
        } else {
            $(sectionElement).find("#noScoresWarning").addClass(domConstants.HIDDEN_CLASS_NAME);
            $(tableBaseElement).removeClass(domConstants.HIDDEN_CLASS_NAME);

            for (let i = 0; i < 10; i++) {
                if (scores.length > i) {
                    $(tableBaseElement).find(`tr[row-index=${i}]`).removeClass(domConstants.HIDDEN_CLASS_NAME);
                    $(tableBaseElement).find(`#scoreRounds${i}`).text(scores[i].roundsCompleted);
                    $(tableBaseElement).find(`#scorePoints${i}`).text(scores[i].score);

                    if (scores[i].date instanceof Date) {
                        $(tableBaseElement).find(`#scoreDate${i}`).text(scores[i].date.toISOString().slice(0, 10));
                    } else {
                        $(tableBaseElement).find(`#scoreDate${i}`).text(scores[i].date.toString().slice(0, 10));

                    }
                }
                else {
                    $(tableBaseElement).find(`tr[row-index=${i}]`).addClass(domConstants.HIDDEN_CLASS_NAME);
                }
            }
        }

    }
}