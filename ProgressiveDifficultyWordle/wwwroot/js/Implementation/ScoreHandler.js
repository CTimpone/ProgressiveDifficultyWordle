"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreHandler = void 0;
const typescript_cookie_1 = require("typescript-cookie");
const CookieConstants_1 = require("../Constants/CookieConstants");
const GameType_1 = require("../Models/GameType");
const HighScore_1 = require("../Models/Scoring/HighScore");
const ScoreWrapper_1 = require("../Models/Scoring/ScoreWrapper");
class ScoreHandler {
    constructor() {
        const existingScoreHistory = (0, typescript_cookie_1.getCookie)(CookieConstants_1.cookieConstants.SCORE_COOKIE_NAME);
        if (existingScoreHistory !== undefined) {
            try {
                this.scoreHistory = JSON.parse(existingScoreHistory);
            }
            catch (ex) {
                console.log(`Error parsing score history cookie: ${ex}. Resetting to default.`);
                this.scoreHistory = new ScoreWrapper_1.ScoreWrapper();
            }
        }
        else {
            this.scoreHistory = new ScoreWrapper_1.ScoreWrapper();
        }
    }
    updateHighScores(type, details, success, guessCount) {
        switch (type) {
            case GameType_1.GameType.Endless:
                this.scoreHistory.endlessScores = this.updateScoreArray(this.scoreHistory.endlessScores, details);
                break;
            case GameType_1.GameType.ProgressiveDifficulty:
                this.scoreHistory.scalingScores = this.updateScoreArray(this.scoreHistory.scalingScores, details);
                break;
            case GameType_1.GameType.Single:
                this.scoreHistory.singleHistory.totalRounds += 1;
                if (success === true) {
                    this.scoreHistory.singleHistory.successfulRounds += 1;
                    this.scoreHistory.singleHistory.consecutiveWins += 1;
                    if (this.scoreHistory.singleHistory.guessMap.has(guessCount)) {
                        this.scoreHistory.singleHistory.guessMap.set(guessCount, this.scoreHistory.singleHistory.guessMap.get(guessCount) + 1);
                    }
                    else {
                        this.scoreHistory.singleHistory.guessMap.set(guessCount, 1);
                    }
                }
                else {
                    this.scoreHistory.singleHistory.failedRounds += 1;
                    this.scoreHistory.singleHistory.consecutiveWins = 0;
                }
                break;
            default:
                console.log("Invalid game type, no score updates.");
        }
        (0, typescript_cookie_1.removeCookie)(CookieConstants_1.cookieConstants.SCORE_COOKIE_NAME);
        (0, typescript_cookie_1.setCookie)(CookieConstants_1.cookieConstants.SCORE_COOKIE_NAME, JSON.stringify(this.scoreHistory), { expires: 365 });
    }
    updateScoreArray(oldScores, newScore) {
        let insertedNewScore = false;
        const mappedScore = new HighScore_1.HighScore(newScore);
        for (let i = 0; i < oldScores.length; i++) {
            if (!insertedNewScore && oldScores[i].score < newScore.totalScore) {
                oldScores.splice(i, 0, mappedScore);
                insertedNewScore = true;
            }
        }
        if (oldScores.length > 10) {
            oldScores = oldScores.slice(0, 10);
        }
        else if (!insertedNewScore && oldScores.length < 10) {
            oldScores.push(mappedScore);
        }
        return oldScores;
    }
    displayScores(type) {
        throw new Error("Method not implemented.");
    }
}
exports.ScoreHandler = ScoreHandler;
//# sourceMappingURL=ScoreHandler.js.map