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
    constructor(type, hardMode, notificationTools, fn) {
        this.type = type;
        this.messaging = notificationTools;
        this.score = new ScoreDetails_1.ScoreDetails();
        this.state = new SessionState_1.SessionState(hardMode);
        this.boardBinder = fn;
        this.generateGame();
        this.state.startTime = this.currentGame.startTime;
    }
    generateGame() {
        this.currentGame = new SingleGame_1.SingleGame(this.generateGameOptions(), new EligibleWords_1.EligibleWords(), this.messaging);
    }
    generateGameOptions() {
        return new GameOptions_1.GameOptions(this.state.hardMode, this.state.maxGuesses, this.state.gameTimerLimitExists, this.state.gameTimerLength);
    }
    next(input) {
        if (this.state.active) {
            switch (this.type) {
                case GameType_1.GameType.Endless:
                    if (this.currentGame.solved()) {
                        this.score.updateScore(this.currentGame);
                        this.generateGame();
                        this.paintBoard();
                    }
                    else if (!this.currentGame.solved() && this.currentGame.endTime !== undefined) {
                        this.state.active = false;
                        this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, "Unsuccessfully solved. To playing, you will need a new session.");
                    }
                    else {
                        this.currentGame.finalizeGuess(input);
                        this.paintBoard();
                        if (this.currentGame.solved()) {
                            this.score.updateScore(this.currentGame);
                            this.generateGame();
                            this.paintBoard();
                        }
                        else if (this.currentGame.endTime) {
                            this.state.active = false;
                        }
                    }
                    break;
                case GameType_1.GameType.ProgressiveDifficulty:
                    if (this.currentGame.solved()) {
                        this.score.updateScore(this.currentGame);
                        this.getHarder();
                        this.generateGame();
                        this.paintBoard();
                    }
                    else if (!this.currentGame.solved() && this.currentGame.endTime !== undefined) {
                        this.state.active = false;
                        this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, "Unsuccessfully solved. To playing, you will need a new session.");
                    }
                    else {
                        this.currentGame.finalizeGuess(input);
                        this.paintBoard();
                        if (this.currentGame.solved()) {
                            this.score.updateScore(this.currentGame);
                            this.getHarder();
                            this.generateGame();
                            this.paintBoard();
                        }
                        else if (this.currentGame.endTime) {
                            this.state.active = false;
                        }
                    }
                    break;
                case GameType_1.GameType.Single:
                    if (this.currentGame.endTime !== undefined) {
                        this.state.active = false;
                        this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, "The game has ended. To continue playing, you will need a new session.");
                    }
                    else {
                        this.currentGame.finalizeGuess(input);
                        this.paintBoard();
                        this.state.active = this.currentGame.endTime === undefined;
                    }
                    break;
                default:
                    const exhaustiveCheck = this.type;
                    throw new Error(exhaustiveCheck);
            }
        }
    }
    getHarder() {
        switch (this.score.roundsCompleted) {
            case 3:
                this.state.gameTimerLimitExists = true;
                this.state.gameTimerLength = 600;
                break;
            case 5:
            case 7:
            case 11:
            case 13:
            case 17:
                this.state.gameTimerLength -= 60;
                break;
            case 19:
            case 21:
            case 23:
            case 25:
            case 27:
            case 29:
                this.state.gameTimerLength -= 30;
                break;
            case 9:
            case 15:
            case 30:
                this.state.maxGuesses -= 1;
                break;
            default:
                break;
        }
    }
    paintBoard() {
        this.boardBinder(this.currentGame.userGuesses.map(guess => guess.guess), this.currentGame.userGuesses.map(guess => guess.characterStates));
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map