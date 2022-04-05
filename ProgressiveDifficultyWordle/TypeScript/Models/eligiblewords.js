"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibleWords = void 0;
const FiveLetterGuesses_1 = require("../Constants/Words/FiveLetterGuesses");
const FiveLetterAnswers_1 = require("../Constants/Words/FiveLetterAnswers");
class EligibleWords {
    constructor(eligibleAnswers, eligibleGuesses, letterCount = 5) {
        if (eligibleAnswers !== undefined && eligibleGuesses !== undefined) {
            this.eligibleAnswers = eligibleAnswers;
            this.eligibleGuesses = eligibleGuesses;
        }
        else if ((eligibleAnswers !== undefined && eligibleGuesses === undefined) ||
            (eligibleAnswers === undefined && eligibleGuesses !== undefined)) {
            console.log('Both eligibleAnswers and eligibleGuesses must be supplied to not rely on constants.');
        }
        if (this.eligibleAnswers === undefined && this.eligibleGuesses === undefined) {
            switch (letterCount) {
                case 5:
                    this.eligibleAnswers = FiveLetterAnswers_1.FIVE_LETTER_ANSWERS;
                    this.eligibleGuesses = FiveLetterGuesses_1.FIVE_LETTER_GUESSES;
                    break;
                default:
                    throw new Error(`No word-sets configured for letterCount=${letterCount}`);
            }
        }
        this.buildGuessSearchHelper();
    }
    buildGuessSearchHelper() {
        this.guessSearchHelper = new Map();
        for (let i = 0; i < this.eligibleGuesses.length; i++) {
            let currentLetter = this.eligibleGuesses[i][0];
            if (!this.guessSearchHelper.has(currentLetter)) {
                this.guessSearchHelper.set(currentLetter, [i, i]);
                if (i !== 0) {
                    this.guessSearchHelper.get(this.eligibleGuesses[i - 1][0])[1] = i - 1;
                }
            }
        }
        this.guessSearchHelper.get(this.eligibleGuesses[this.eligibleGuesses.length - 1][0])[1] = this.eligibleGuesses.length - 1;
    }
    guessInWordList(target) {
        if (!this.guessSearchHelper.has(target[0])) {
            return false;
        }
        let [start, end] = this.guessSearchHelper.get(target[0]);
        console.log(start);
        console.log(end);
        while (start <= end) {
            let midPoint = start + Math.floor((end - start) / 2);
            let midVal = this.eligibleGuesses[midPoint];
            if (midVal === target) {
                return true;
            }
            else if (midVal > target) {
                end = midPoint - 1;
            }
            else {
                start = midPoint + 1;
            }
        }
        return false;
    }
}
exports.EligibleWords = EligibleWords;
//# sourceMappingURL=eligiblewords.js.map