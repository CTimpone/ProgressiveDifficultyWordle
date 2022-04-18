"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionState = void 0;
class SessionState {
    constructor(hardMode) {
        this.gameHistory = [];
        this.active = true;
        this.startTime = new Date();
        this.gameTimerLimitExists = false;
        this.hardMode = hardMode;
        this.maxGuesses = 6;
    }
}
exports.SessionState = SessionState;
//# sourceMappingURL=SessionState.js.map