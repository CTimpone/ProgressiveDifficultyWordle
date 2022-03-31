var PDW;
(function (PDW) {
    class SingleGame {
        constructor(options, eligibleWords) {
            this.options = options;
            this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
            this.letterState = new PDW.LetterState();
            this.userGuesses = [];
            this.startTime = new Date();
            this.eligibleWords = eligibleWords;
        }
        guessTrigger(input) {
            input = input.toLowerCase();
            if (this.validateGuess(input)) {
                this.finalizeGuess(input);
            }
            return this.endTime !== undefined;
        }
        validateGuess(input) {
            if (this.endTime !== undefined) {
                return false;
            }
            if (this.options.maxGuesses <= this.userGuesses.length) {
                return false;
            }
            let inputRegex = /[a-z]/g;
            if (input.match(inputRegex).length != input.length) {
                return false;
            }
            if (this.options.hardMode) {
                for (let i = 0; i < input.length; i++) {
                    if (this.letterState.ExactMatch.has(i) && input[i] != this.letterState.ExactMatch.get(i)) {
                        return false;
                    }
                }
            }
            if (!this.eligibleWords.guessInWordList(input)) {
                return false;
            }
            return true;
        }
        finalizeGuess(input) {
            input = input.toLowerCase();
            let currentGuess = new PDW.GuessDetails(input, this.chosenWord);
            if (currentGuess.fullMatch || this.userGuesses.length === this.options.maxGuesses) {
                this.endTime = new Date();
            }
            console.log(currentGuess.characterStates);
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
            this.userGuesses.push(currentGuess);
        }
    }
    PDW.SingleGame = SingleGame;
})(PDW || (PDW = {}));
//# sourceMappingURL=SingleGame.js.map