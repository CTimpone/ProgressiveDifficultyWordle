import { GuessDetails } from './GuessDetails';
import { LetterStatus } from '../Models/LetterStatus';
import { LetterState } from '../Models/LetterState';
import { GameOptions } from '../Models/GameOptions';
import { EligibleWords } from './EligibleWords';
import { NotificationEventing } from '../Notification/NotificationEventing';
import { NotificationWrapper } from '../Notification/NotificationWrapper';
import { NotificationType } from '../Models/NotificationType';
import { GuessResult } from '../Models/GuessResult';
import { GamePainterInterface } from '../Interfaces/GamePainterInterface';

export class SingleGame {
    private timerInterval: NodeJS.Timer | undefined;

    chosenWord: string;
    startTime: Date;
    endTime: Date | undefined;
    letterState: LetterState;
    userGuesses: GuessDetails[];
    options: GameOptions;
    eligibleWords: EligibleWords;
    messaging: NotificationEventing;
    gamePainter: GamePainterInterface;

    constructor(options: GameOptions, eligibleWords: EligibleWords, messaging: NotificationEventing,
        gamePainter: GamePainterInterface, useTimer?: boolean) {
        this.options = options;
        this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
        this.letterState = new LetterState();
        this.userGuesses = [];
        this.startTime = new Date();
        this.eligibleWords = eligibleWords;
        this.messaging = messaging;
        this.gamePainter = gamePainter;

        if (useTimer === true) {
            this.runTimer();
        }
    }

    guessTrigger(input: string): GuessResult {
        input = input.toLowerCase();

        if (this.validateGuess(input)) {
            this.finalizeGuess(input);
        }
        else {
            return GuessResult.Invalid;
        }

        return this.endTime === undefined ? GuessResult.Progress : GuessResult.GameComplete;
    }

    validateGuess(input: string): boolean {
        if (this.endTime !== undefined) {
            this.messaging.message = new NotificationWrapper(NotificationType.Error, "The game has already ended.");
            return false;
        }

        if (this.options.maxGuesses <= this.userGuesses.length) {
            this.messaging.message = new NotificationWrapper(NotificationType.Error,
                `Exceeded max number ${this.options.maxGuesses} of guesses.`);

            return false;
        }

        const inputRegex = /[a-z]/g;
        const match = input.match(inputRegex);
        if (match === null || match.length != this.chosenWord.length) {
            this.messaging.message = new NotificationWrapper(NotificationType.Error, "Invalid input.");

            return false;
        }

        if (this.options.hardMode) {
            for (let i = 0; i < input.length; i++) {
                if (this.letterState.ExactMatch.has(i) && input[i] != this.letterState.ExactMatch.get(i)) {
                    this.messaging.message = new NotificationWrapper(NotificationType.Error,
                        NotificationWrapper.interpolateMessage("Hard mode rules violated: REPLACEMENT=>text.",
                        `'${this.letterState.ExactMatch.get(i)}' must be present at character index ${i} of ${input.length - 1}`));

                    return false;
                }
            }
        }

        if (!this.eligibleWords.guessInWordList(input)) {
            this.messaging.message = new NotificationWrapper(NotificationType.Error,
                `'${input.toUpperCase()}' is not in word list.`);

            return false;
        }

        return true;
    }

    finalizeGuess(input: string): void {
        const currentGuess = new GuessDetails(input, this.chosenWord);
        this.userGuesses.push(currentGuess);
        for (let i = 0; i < currentGuess.characterStates.length; i++) {
            switch (currentGuess.characterStates[i]) {
                case LetterStatus.ExactMatch:
                    this.letterState.ExactMatch.set(i, input[i]);
                    break;
                case LetterStatus.WrongLocation:
                    if (this.letterState.PresentBadLocations.has(input[i]) && this.letterState.PresentBadLocations.get(input[i]).indexOf(i) > -1) {
                        this.letterState.PresentBadLocations.get(input[i]).push(i);
                    } else if (!this.letterState.PresentBadLocations.has(input[i])) {
                        this.letterState.PresentBadLocations.set(input[i], [i]);
                    }
                    break;
                case LetterStatus.Absent:
                    if (this.letterState.Absent.indexOf(input[i]) === -1) {
                        this.letterState.Absent.push(input[i]);
                    }
                    break;
                default:
                    throw new Error(`Invalid status for guess input at ${i}: status of ${currentGuess.characterStates[i]}`)
            }
        }

        if (this.solved()) {
            this.messaging.message = new NotificationWrapper(NotificationType.Info, `Successful solve - '${this.chosenWord.toUpperCase()}'!`);
            this.endTime = new Date();

            if (this.timerInterval !== undefined) {
                clearInterval(this.timerInterval);
            }
        } else if (this.userGuesses.length >= this.options.maxGuesses && this.endTime === undefined) {
            this.messaging.message = new NotificationWrapper(NotificationType.Error,
                `Exceeded max number ${this.options.maxGuesses} of guesses; the correct answer was '${this.chosenWord.toUpperCase()}'`);
            this.endTime = new Date();

            if (this.timerInterval !== undefined) {
                clearInterval(this.timerInterval);
            }
        }
    }

    solved(): boolean {
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
            console.log(gameScope.options.maxTimeLimitExists, seconds);
            if (gameScope.options.maxTimeLimitExists && seconds <= 0) {
                console.log("triggered");

                gameScope.messaging.message = new NotificationWrapper(NotificationType.Error,
                    `The timer has ended; the correct answer was '${gameScope.chosenWord.toUpperCase()}'`);
                gameScope.endTime = new Date();

                clearInterval(gameScope.timerInterval);
            }
        }, 1000);
    }
}