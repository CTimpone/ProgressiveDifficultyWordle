"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const GameType_1 = require("./GameType");
const ScoreDetails_1 = require("./ScoreDetails");
const SingleGame_1 = require("./SingleGame");
const SessionState_1 = require("./SessionState");
const GameOptions_1 = require("./GameOptions");
const EligibleWords_1 = require("./EligibleWords");
const NotificationWrapper_1 = require("./Notification/NotificationWrapper");
const NotificationType_1 = require("./Notification/NotificationType");
const GuessResult_1 = require("./GuessResult");
class Session {
    constructor(type, hardMode, eligibleAnswers, eligibleGuesses, notificationTools, domManipulator) {
        this.type = type;
        this.messaging = notificationTools;
        this.score = new ScoreDetails_1.ScoreDetails();
        this.state = new SessionState_1.SessionState(hardMode);
        this.domManipulator = domManipulator;
        this.eligibleWords = new EligibleWords_1.EligibleWords(eligibleAnswers, eligibleGuesses);
        this.generateGame();
        this.state.startTime = this.currentGame.startTime;
    }
    next(input) {
        let guessResult;
        if (this.state.active) {
            if (this.type === GameType_1.GameType.Single) {
                guessResult = this.currentGame.guessTrigger(input);
                this.state.active = this.currentGame.endTime === undefined;
            }
            else {
                guessResult = this.currentGame.guessTrigger(input);
                if (this.currentGame.solved()) {
                    this.anotherGame();
                }
                else if (this.currentGame.endTime) {
                    this.state.active = false;
                    this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, "Unsuccessfully solved. To keep playing, you will need a new session.");
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
    paintBoard(game, onlyPaintLast) {
        game = game !== null && game !== void 0 ? game : this.currentGame;
        onlyPaintLast = onlyPaintLast !== null && onlyPaintLast !== void 0 ? onlyPaintLast : false;
        this.domManipulator.paintBoard(game.userGuesses.map(guess => guess.guess), game.userGuesses.map(guess => guess.characterStates), onlyPaintLast, game.endTime === undefined);
    }
    generateGame() {
        this.currentGame = new SingleGame_1.SingleGame(this.generateGameOptions(), this.eligibleWords, this.messaging, this.domManipulator, true);
    }
    generateGameOptions() {
        return new GameOptions_1.GameOptions(this.state.hardMode, this.state.maxGuesses, this.state.gameTimerLimitExists, this.state.gameTimerLength);
    }
    anotherGame() {
        this.state.gameHistory.push(this.currentGame);
        this.score.updateScore(this.currentGame);
        if (this.type === GameType_1.GameType.ProgressiveDifficulty) {
            this.state.getHarder(this.score.roundsCompleted);
        }
        this.generateGame();
        this.paintBoard();
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map