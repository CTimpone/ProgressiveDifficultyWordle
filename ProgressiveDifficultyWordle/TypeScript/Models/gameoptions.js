"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameOptions = void 0;
class GameOptions {
    constructor(hardMode = false, maxGuesses = 6, maxTimeLimitExists = false, maxTimeLimit = 600) {
        this.hardMode = hardMode;
        this.maxGuesses = maxGuesses;
        this.maxTimeLimitExists = maxTimeLimitExists;
        this.maxTimeLimit = maxTimeLimit;
    }
}
exports.GameOptions = GameOptions;
//# sourceMappingURL=gameoptions.js.map