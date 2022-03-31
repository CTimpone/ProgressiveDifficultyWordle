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
        validateGuess(input) {
        }
        processGuess(input) {
            input = input.toLowerCase();
            let currentGuess = new PDW.GuessDetails(input, this.chosenWord);
            this.userGuesses.push(currentGuess);
            if (currentGuess.fullMatch || this.userGuesses.length == this.options.maxGuesses) {
                this.endTime = new Date();
            }
            for (let i = 0; i < currentGuess.characterStates.length; i++) {
                switch (currentGuess.characterStates[i]) {
                    case PDW.LetterStatus.ExactMatch:
                        this.letterState.ExactMatch.set(i, input[i]);
                        break;
                    case PDW.LetterStatus.WrongLocation:
                        if (this.letterState.PresentBadLocations.has(input[i]) && this.letterState.PresentBadLocations.get(input[i]).indexOf(i) > -1) {
                            this.letterState.PresentBadLocations.get(input[i]).push(i);
                        }
                        else if (!this.letterState.PresentBadLocations.has(input[i])) {
                            this.letterState.PresentBadLocations.set(input[i], [i]);
                        }
                        break;
                    case PDW.LetterStatus.Absent:
                        if (this.letterState.Absent.indexOf(input[i]) === -1) {
                            this.letterState.Absent.push(input[i]);
                        }
                        break;
                    default:
                        throw new Error(`Invalid status for guess input at ${i}: status of ${currentGuess.characterStates[i]}`);
                }
            }
        }
    }
    PDW.SingleGame = SingleGame;
})(PDW || (PDW = {}));
//# sourceMappingURL=SingleGame.js.map