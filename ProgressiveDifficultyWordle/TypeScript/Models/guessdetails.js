"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleGame = exports.GuessDetails = exports.SessionState = exports.Session = void 0;
const LetterStatus_1 = require("./LetterStatus");
const LetterState_1 = require("./LetterState");
class Session {
}
exports.Session = Session;
class SessionState {
}
exports.SessionState = SessionState;
class GuessDetails {
    constructor(input, answer) {
        this.guess = input;
        this.characterStates = new Array(5);
        let answerMap = new Map();
        let inputMap = new Map();
        for (let i = 0; i < answer.length; i++) {
            this.updateCharacterMap(answerMap, answer, i);
            this.updateCharacterMap(inputMap, input, i);
        }
        console.log(inputMap);
        console.log(answerMap);
        this.populateCharacterStates(inputMap, answerMap);
        this.fullMatch = this.characterStates.every((state) => state === LetterStatus_1.LetterStatus.ExactMatch);
    }
    updateCharacterMap(map, value, index) {
        if (!map.has(value[index])) {
            map.set(value[index], [index]);
        }
        else {
            map.get(value[index]).push(index);
        }
    }
    populateCharacterStates(inputMap, answerMap) {
        for (let key of inputMap.keys()) {
            let inputIndices = inputMap.get(key);
            if (answerMap.has(key)) {
                let answerIndices = answerMap.get(key);
                if (answerIndices.length >= inputIndices.length) {
                    for (let charIndex of inputIndices) {
                        this.characterStates[charIndex] = answerIndices.indexOf(charIndex) > -1 ? LetterStatus_1.LetterStatus.ExactMatch : LetterStatus_1.LetterStatus.WrongLocation;
                    }
                }
                else {
                    let exactMatchCount = 0;
                    let potentialLocationIndices = [];
                    for (let charIndex of inputIndices) {
                        if (answerIndices.indexOf(charIndex) > -1) {
                            this.characterStates[charIndex] = LetterStatus_1.LetterStatus.ExactMatch;
                            exactMatchCount += 1;
                        }
                        else {
                            this.characterStates[charIndex] = LetterStatus_1.LetterStatus.Absent;
                            potentialLocationIndices.push(charIndex);
                        }
                        let locationIncorrectMatches = answerIndices.length - exactMatchCount;
                        if (locationIncorrectMatches > 0) {
                            for (locationIncorrectMatches; locationIncorrectMatches > 0; locationIncorrectMatches--) {
                                this.characterStates[potentialLocationIndices.shift()] = LetterStatus_1.LetterStatus.WrongLocation;
                            }
                        }
                    }
                }
            }
            else {
                for (let absentIndex of inputMap.get(key)) {
                    this.characterStates[absentIndex] = LetterStatus_1.LetterStatus.Absent;
                }
            }
        }
    }
}
exports.GuessDetails = GuessDetails;
class SingleGame {
    constructor(options, eligibleWords) {
        this.options = options;
        this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
        this.letterState = new LetterState_1.LetterState();
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
        let currentGuess = new GuessDetails(input, this.chosenWord);
        if (currentGuess.fullMatch || this.userGuesses.length === this.options.maxGuesses) {
            this.endTime = new Date();
        }
        console.log(currentGuess.characterStates);
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
        this.userGuesses.push(currentGuess);
    }
}
exports.SingleGame = SingleGame;
//# sourceMappingURL=session.js.map