import { getCookie, setCookie } from "typescript-cookie";

import { cookieConstants } from "../Constants/CookieConstants";
import { ScorePainter } from "../HtmlPainters/ScorePainter";

import { ScoreHandlingInterface } from "../Interfaces/ScoreHandlingInterface";
import { ScorePainterInterface } from "../Interfaces/ScorePainterInterface";

import { GameType } from "../Models/GameType";
import { HighScore } from "../Models/Scoring/HighScore";
import { ScoreWrapper } from "../Models/Scoring/ScoreWrapper";
import { ScoreDetails } from "../WordleAccessLayer/ScoreDetails";

export class ScoreHandler implements ScoreHandlingInterface {
    scoreHistory: ScoreWrapper;

    private painter: ScorePainterInterface;

    constructor() {
        const existingScoreHistory = getCookie(cookieConstants.SCORE_COOKIE_NAME);
        if (existingScoreHistory !== undefined) {
            try {
                this.scoreHistory = JSON.parse(existingScoreHistory, this.mapJsonParseReviver);
            } catch (ex) {
                console.log(`Error parsing score history cookie: ${ex}. Resetting to default.`);
                this.scoreHistory = new ScoreWrapper();
            }
        } else {
            this.scoreHistory = new ScoreWrapper();
        }

        this.painter = new ScorePainter(this.scoreHistory);
    }

    updateHighScores(type: GameType, details: ScoreDetails, success?: boolean, guessCount?: number): void {
        switch (type) {
            case GameType.Endless:
                this.scoreHistory.endlessScores = this.updateScoreArray(this.scoreHistory.endlessScores, details);
                break;
            case GameType.ProgressiveDifficulty:
                this.scoreHistory.scalingScores = this.updateScoreArray(this.scoreHistory.scalingScores, details);
                break;
            case GameType.Single:
                this.scoreHistory.singleHistory.totalRounds += 1;
                if (success === true) {
                    this.scoreHistory.singleHistory.successfulRounds += 1;
                    this.scoreHistory.singleHistory.consecutiveWins += 1;
                    if (this.scoreHistory.singleHistory.guessMap.has(guessCount)) {
                        this.scoreHistory.singleHistory.guessMap.set(guessCount,
                            this.scoreHistory.singleHistory.guessMap.get(guessCount) + 1);
                    } else {
                        this.scoreHistory.singleHistory.guessMap.set(guessCount, 1);
                    }
                } else {
                    this.scoreHistory.singleHistory.failedRounds += 1;
                    this.scoreHistory.singleHistory.consecutiveWins = 0;
                }

                break;
            default:
                console.log("Invalid game type, no score updates.");
        }

        this.painter.storeScoreData(this.scoreHistory);
        setCookie(cookieConstants.SCORE_COOKIE_NAME,
            JSON.stringify(this.scoreHistory, this.mapJsonStringifyReplacement), { expires: 365 });
    }

    displayScores(type: GameType): void {
        this.painter.paintScores(type);
        this.painter.swapToScoreSection();
    }

    accessPainter(): ScorePainterInterface {
        return this.painter;
    }

    private updateScoreArray(oldScores: HighScore[], newScore: ScoreDetails): HighScore[] {
        let insertedNewScore = false;
        const mappedScore = new HighScore(newScore);
        for (let i = 0; i < oldScores.length; i++) {
            if (!insertedNewScore && oldScores[i].score < newScore.totalScore) {
                oldScores.splice(i, 0, mappedScore);
                insertedNewScore = true;
            }
        }

        if (oldScores.length > 10) {
            oldScores = oldScores.slice(0, 10);
        } else if (!insertedNewScore && oldScores.length < 10) {
            oldScores.push(mappedScore)
        }

        return oldScores;
    }

    //Adapted from https://stackoverflow.com/a/56150320
    private mapJsonStringifyReplacement(key, value) {
        if (value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()), 
            };
        } else {
            return value;
        }
    }

    private mapJsonParseReviver(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
                return new Map(value.value);
            }
        }
        return value;
    }

}