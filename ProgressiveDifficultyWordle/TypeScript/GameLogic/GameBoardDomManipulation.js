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
class Session {
    constructor(type, hardMode, eligibleAnswers, eligibleGuesses, notificationTools, fn) {
        this.type = type;
        this.messaging = notificationTools;
        this.score = new ScoreDetails_1.ScoreDetails();
        this.state = new SessionState_1.SessionState(hardMode);
        this.boardBinder = fn;
        this.eligibleWords = new EligibleWords_1.EligibleWords(eligibleAnswers, eligibleGuesses);
        this.generateGame();
        this.state.startTime = this.currentGame.startTime;
    }
    next(input) {
        if (this.state.active) {
            if (this.type === GameType_1.GameType.Single) {
                this.currentGame.finalizeGuess(input);
                this.paintBoard();
                this.state.active = this.currentGame.endTime === undefined;
            }
            else {
                this.currentGame.finalizeGuess(input);
                this.paintBoard();
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
    }
    isCurrentGameNew() {
        return this.currentGame !== undefined && this.currentGame.userGuesses.length === 0;
    }
    paintBoard(game, onlyPaintLast) {
        game = game !== null && game !== void 0 ? game : this.currentGame;
        onlyPaintLast = onlyPaintLast !== null && onlyPaintLast !== void 0 ? onlyPaintLast : false;
        this.boardBinder(game.userGuesses.map(guess => guess.guess), game.userGuesses.map(guess => guess.characterStates), onlyPaintLast);
    }
    generateGame() {
        this.currentGame = new SingleGame_1.SingleGame(this.generateGameOptions(), this.eligibleWords, this.messaging);
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