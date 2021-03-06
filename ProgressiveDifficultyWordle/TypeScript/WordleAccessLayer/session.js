"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const GameType_1 = require("../Models/GameType");
const ScoreDetails_1 = require("./ScoreDetails");
const SingleGame_1 = require("./SingleGame");
const SessionState_1 = require("./SessionState");
const GameOptions_1 = require("../Models/GameOptions");
const EligibleWords_1 = require("./EligibleWords");
const NotificationWrapper_1 = require("../Notification/NotificationWrapper");
const NotificationType_1 = require("../Models/NotificationType");
const GuessResult_1 = require("../Models/GuessResult");
class Session {
    constructor(type, eligibleAnswers, eligibleGuesses, notificationTools, gamePainter, scoreHandler, hardMode, maxGuesses, timerEnabled, timerLength) {
        this.type = type;
        this.messaging = notificationTools;
        this.score = new ScoreDetails_1.ScoreDetails();
        this.state = new SessionState_1.SessionState(hardMode, maxGuesses, timerEnabled, timerLength);
        this.gamePainter = gamePainter;
        this.scoreHandler = scoreHandler;
        this.eligibleWords = new EligibleWords_1.EligibleWords(eligibleAnswers, eligibleGuesses);
        this.generateGame();
        this.state.startTime = this.currentGame.startTime;
    }
    next(input) {
        let guessResult;
        if (this.state.active) {
            if (this.type === GameType_1.GameType.Single) {
                guessResult = this.currentGame.guessTrigger(input);
                if (!this.isCurrentGameActive()) {
                    this.score.updateScore(this.currentGame);
                    this.paintDetails();
                    this.scoreHandler.updateHighScores(this.type, this.score, this.currentGame.solved(), this.currentGame.userGuesses.length);
                }
            }
            else {
                guessResult = this.currentGame.guessTrigger(input);
                if (this.currentGame.solved()) {
                    this.anotherGame();
                }
                else if (!this.isCurrentGameActive()) {
                    this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, `The answer was '${this.currentGame.chosenWord.toUpperCase()}. Create a new session to play again.'`);
                    this.score.endTime = this.currentGame.endTime;
                    if (this.score.totalScore > 0) {
                        this.scoreHandler.updateHighScores(this.type, this.score);
                    }
                }
            }
        }
        else {
            this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, "The session has ended. To keep playing, you will need a new session.");
        }
        if (guessResult === GuessResult_1.GuessResult.Progress || guessResult === GuessResult_1.GuessResult.GameComplete) {
            this.paintBoard();
        }
        return guessResult;
    }
    isCurrentGameNew() {
        return this.currentGame !== undefined && this.currentGame.userGuesses.length === 0;
    }
    isCurrentGameActive() {
        this.state.active = this.currentGame.endTime === undefined;
        return this.state.active;
    }
    paintBoard(game, onlyPaintLast) {
        game = game !== null && game !== void 0 ? game : this.currentGame;
        onlyPaintLast = onlyPaintLast !== null && onlyPaintLast !== void 0 ? onlyPaintLast : false;
        this.gamePainter.paintBoard(game.userGuesses.map(guess => guess.guess), game.userGuesses.map(guess => guess.characterStates), onlyPaintLast, game.endTime === undefined);
    }
    release() {
        this.currentGame.stopTimer();
    }
    generateGame() {
        this.currentGame = new SingleGame_1.SingleGame(this.generateGameOptions(), this.eligibleWords, this.messaging, this.gamePainter, true);
        this.paintDetails();
        this.gamePainter.truncateBoard(this.currentGame.options.maxGuesses);
        this.paintBoard();
    }
    generateGameOptions() {
        return new GameOptions_1.GameOptions(this.state.hardMode, this.state.maxGuesses, this.state.gameTimerLimitExists, this.state.gameTimerLength);
    }
    paintDetails() {
        this.gamePainter.paintDetails(this.type, this.state, this.score);
    }
    anotherGame() {
        this.state.gameHistory.push(this.currentGame);
        this.score.updateScore(this.currentGame);
        if (this.type === GameType_1.GameType.ProgressiveDifficulty) {
            this.state.getHarder(this.score.roundsCompleted);
        }
        this.generateGame();
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map