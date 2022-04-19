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
        this.generateGame();
        this.state.startTime = this.currentGame.startTime;
    }
    generateGame() {
        this.currentGame = new SingleGame_1.SingleGame(this.generateGameOptions(), new EligibleWords_1.EligibleWords(this.eligibleAnswers, this.eligibleGuesses), this.messaging);
    }
    generateGameOptions() {
        return new GameOptions_1.GameOptions(this.state.hardMode, this.state.maxGuesses, this.state.gameTimerLimitExists, this.state.gameTimerLength);
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
    anotherGame() {
        this.state.gameHistory.push(this.currentGame);
        if (this.type === GameType_1.GameType.ProgressiveDifficulty) {
            this.getHarder();
        }
        this.generateGame();
        this.paintBoard();
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
                console.log("No difficulty increase.");
                break;
        }
    }
    paintBoard(game) {
        game = game !== null && game !== void 0 ? game : this.currentGame;
        this.boardBinder(game.userGuesses.map(guess => guess.guess), game.userGuesses.map(guess => guess.characterStates));
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map