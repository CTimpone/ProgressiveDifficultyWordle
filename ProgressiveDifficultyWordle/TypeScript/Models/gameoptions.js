var PDW;
(function (PDW) {
    class GameOptions {
        constructor(hardMode = false, maxGuesses = 6, maxTimeLimitExists = false, maxTimeLimit = 600) {
            this.hardMode = hardMode;
            this.maxGuesses = maxGuesses;
            this.maxTimeLimitExists = maxTimeLimitExists;
            this.maxTimeLimit = maxTimeLimit;
        }
    }
    PDW.GameOptions = GameOptions;
})(PDW || (PDW = {}));
//# sourceMappingURL=gameoptions.js.map