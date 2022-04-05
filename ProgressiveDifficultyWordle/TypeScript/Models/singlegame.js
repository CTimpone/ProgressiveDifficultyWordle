"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleGame = void 0;
const GuessDetails_1 = require("./GuessDetails");
const LetterStatus_1 = require("./LetterStatus");
const LetterState_1 = require("./LetterState");
class SingleGame {
    constructor(options, eligibleWords, messaging) {
        this.options = options;
        this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
        this.letterState = new LetterState_1.LetterState();
        this.userGuesses = [];
        this.startTime = new Date();
        this.eligibleWords = eligibleWords;
        this.messaging = messaging;
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
        let match = input.match(inputRegex);
        if (match === null || match.length != input.length) {
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
        let currentGuess = new GuessDetails_1.GuessDetails(input, this.chosenWord);
        this.userGuesses.push(currentGuess);
        if (currentGuess.fullMatch) {
            this.endTime = new Date();
        }
        else if (this.userGuesses.length >= this.options.maxGuesses && this.endTime === undefined) {
            this.endTime = new Date();
        }
        for (let i = 0; i < currentGuess.characterStates.length; i++) {
            switch (currentGuess.characterStates[i]) {
                case LetterStatus_1.LetterStatus.ExactMatch:
                    this.letterState.ExactMatch.set(i, input[i]);
                    break;
                case LetterStatus_1.LetterStatus.WrongLocation:
                    if (this.letterState.PresentBadLocations.has(input[i]) && this.letterState.PresentBadLocations.get(input[i]).indexOf(i) > -1) {
                        this.letterState.PresentBadLocations.get(input[i]).push(i);
                    }
                    else if (!this.letterState.PresentBadLocations.has(input[i])) {
                        this.letterState.PresentBadLocations.set(input[i], [i]);
                    }
                    break;
                case LetterStatus_1.LetterStatus.Absent:
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
exports.SingleGame = SingleGame;
//# sourceMappingURL=SingleGame.js.map