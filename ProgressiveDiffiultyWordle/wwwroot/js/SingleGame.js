var PDW;
(function (PDW) {
    class SingleGame {
        constructor(options) {
            this.options = options;
            this.chosenWord = PDW.EligibleWords.EligibleAnswers[Math.floor(Math.random() * PDW.EligibleWords.EligibleAnswers.length)];
            this.letterState = new PDW.LetterState();
            this.userGuesses = [];
            this.startTime = new Date();
        }
        processGuess(input) {
            input = input.toLowerCase();
            let currentGuess = new PDW.GuessDetails(input, this.chosenWord);
            this.userGuesses.push(currentGuess);
            if (currentGuess.fullMatch || this.userGuesses.length == this.options.maxGuesses) {
                this.endTime = new Date();
            }
        }
    }
    PDW.SingleGame = SingleGame;
})(PDW || (PDW = {}));
//# sourceMappingURL=SingleGame.js.map