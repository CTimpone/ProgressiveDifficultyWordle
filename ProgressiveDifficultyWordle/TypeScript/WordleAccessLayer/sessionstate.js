"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionState = void 0;
class SessionState {
    constructor(hardMode, maxGuesses, timerEnabled, timerLength) {
        this.gameHistory = [];
        this.active = true;
        this.startTime = new Date();
        if (timerEnabled === true) {
            this.gameTimerLimitExists = true;
            this.gameTimerLength = timerLength !== null && timerLength !== void 0 ? timerLength : 600;
        }
        else {
            this.gameTimerLimitExists = false;
        }
        if (maxGuesses !== undefined) {
            this.maxGuesses = maxGuesses;
        }
        else {
            this.maxGuesses = 6;
        }
        this.hardMode = hardMode;
    }
    getHarder(roundsCompleted) {
        switch (roundsCompleted) {
            case 3:
                this.gameTimerLimitExists = true;
                this.gameTimerLength = 600;
                break;
            case 5:
            case 7:
            case 11:
            case 13:
            case 17:
                this.gameTimerLength -= 60;
                break;
            case 19:
            case 21:
            case 23:
            case 25:
            case 27:
            case 29:
                this.gameTimerLength -= 30;
                break;
            case 9:
            case 15:
            case 30:
                this.maxGuesses -= 1;
                break;
            default:
                console.log("No difficulty increase.");
                break;
        }
    }
}
exports.SessionState = SessionState;
//# sourceMappingURL=SessionState.js.map