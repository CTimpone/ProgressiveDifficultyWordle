"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleGame = void 0;
const GuessDetails_1 = require("./GuessDetails");
const LetterStatus_1 = require("../Models/LetterStatus");
const LetterState_1 = require("../Models/LetterState");
const NotificationWrapper_1 = require("../Notification/NotificationWrapper");
const NotificationType_1 = require("../Models/NotificationType");
const GuessResult_1 = require("../Models/GuessResult");
class SingleGame {
    constructor(options, eligibleWords, messaging, gamePainter, useTimer) {
        this.options = options;
        this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
        this.letterState = new LetterState_1.LetterState();
        this.userGuesses = [];
        this.startTime = new Date();
        this.eligibleWords = eligibleWords;
        this.messaging = messaging;
        this.gamePainter = gamePainter;
        if (useTimer === true) {
            this.runTimer();
        }
    }
    guessTrigger(input) {
        input = input.toLowerCase();
        if (this.validateGuess(input)) {
            this.finalizeGuess(input);
        }
        else {
            return GuessResult_1.GuessResult.Invalid;
        }
        return this.endTime === undefined ? GuessResult_1.GuessResult.Progress : GuessResult_1.GuessResult.GameComplete;
    }
    validateGuess(input) {
        if (this.endTime !== undefined) {
            this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, "The game has already ended.");
            return false;
        }
        if (this.options.maxGuesses <= this.userGuesses.length) {
            this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, `Exceeded max number ${this.options.maxGuesses} of guesses.`);
            return false;
        }
        const inputRegex = /[a-z]/g;
        const match = input.match(inputRegex);
        if (match === null || match.length != this.chosenWord.length) {
            this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, "Invalid input.");
            return false;
        }
        if (this.options.hardMode) {
            for (let i = 0; i < input.length; i++) {
                if (this.letterState.ExactMatch.has(i) && input[i] != this.letterState.ExactMatch.get(i)) {
                    this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, NotificationWrapper_1.NotificationWrapper.interpolateMessage("Hard mode rules violated: REPLACEMENT=>text.", `'${this.letterState.ExactMatch.get(i)}' must be present at character index ${i} of ${input.length - 1}`));
                    return false;
                }
            }
        }
        if (!this.eligibleWords.guessInWordList(input)) {
            this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, `'${input.toUpperCase()}' is not in word list.`);
            return false;
        }
        return true;
    }
    finalizeGuess(input) {
        const currentGuess = new GuessDetails_1.GuessDetails(input, this.chosenWord);
        this.userGuesses.push(currentGuess);
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
                    if (!this.letterState.Absent.includes(input[i]) &&
                        !Array.from(this.letterState.ExactMatch.values()).includes(input[i]) &&
                        !this.letterState.PresentBadLocations.has(input[i]) &&
                        i === input.lastIndexOf(input[i])) {
                        this.letterState.Absent.push(input[i]);
                    }
                    break;
                default:
                    throw new Error(`Invalid status for guess input at ${i}: status of ${currentGuess.characterStates[i]}`);
            }
        }
        if (this.solved()) {
            this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Info, `Successful solve - '${this.chosenWord.toUpperCase()}'!`);
            this.endTime = new Date();
            if (this.timerInterval !== undefined) {
                clearInterval(this.timerInterval);
            }
        }
        else if (this.userGuesses.length >= this.options.maxGuesses && this.endTime === undefined) {
            this.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, `Exceeded max number ${this.options.maxGuesses} of guesses; the correct answer was '${this.chosenWord.toUpperCase()}'`);
            this.endTime = new Date();
        }
    }
    solved() {
        return this.userGuesses.length === 0 ? false : this.userGuesses[this.userGuesses.length - 1].fullMatch;
    }
    runTimer() {
        let seconds = 0;
        let increment = 1;
        if (this.options.maxTimeLimitExists) {
            seconds = this.options.maxTimeLimit;
            increment = -1;
        }
        const gameScope = this;
        this.timerInterval = setInterval(function () {
            seconds += increment;
            gameScope.gamePainter.paintTimer(seconds);
            if (gameScope.options.maxTimeLimitExists && seconds <= 0) {
                gameScope.messaging.message = new NotificationWrapper_1.NotificationWrapper(NotificationType_1.NotificationType.Error, `The timer has ended; the correct answer was '${gameScope.chosenWord.toUpperCase()}'`);
                gameScope.endTime = new Date();
                gameScope.stopTimer();
            }
        }, 1000);
    }
    stopTimer() {
        if (this.timerInterval !== undefined) {
            clearInterval(this.timerInterval);
        }
    }
}
exports.SingleGame = SingleGame;
//# sourceMappingURL=SingleGame.js.map