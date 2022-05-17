import { getCookie, setCookie, removeCookie } from "typescript-cookie";
import { cookieConstants } from "../Constants/CookieConstants";
import { ScoreHandlingInterface } from "../Interfaces/ScoreHandlingInterface";
import { GameType } from "../Models/GameType";
import { HighScore } from "../Models/Scoring/HighScore";
import { ScoreWrapper } from "../Models/Scoring/ScoreWrapper";
import { ScoreDetails } from "../WordleAccessLayer/ScoreDetails";

export class ScoreHandler implements ScoreHandlingInterface {
    scoreHistory: ScoreWrapper;

    constructor() {
        const existingScoreHistory = getCookie(cookieConstants.SCORE_COOKIE_NAME);
        if (existingScoreHistory !== undefined) {
            try {
                this.scoreHistory = JSON.parse(existingScoreHistory);
            } catch (ex) {
                console.log(`Error parsing score history cookie: ${ex}. Resetting to default.`);
                this.scoreHistory = new ScoreWrapper();
            }
        } else {
            this.scoreHistory = new ScoreWrapper();
        }
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

        removeCookie(cookieConstants.SCORE_COOKIE_NAME);
        setCookie(cookieConstants.SCORE_COOKIE_NAME, JSON.stringify(this.scoreHistory), { expires: 365 });
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

    displayScores(type: GameType) {
        throw new Error("Method not implemented.");
    }
}