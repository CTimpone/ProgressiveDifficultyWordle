import { GuessDetails } from './GuessDetails';
import { LetterStatus } from './LetterStatus';
import { LetterState } from './LetterState';
import { GameOptions } from './GameOptions';
import { EligibleWords } from './EligibleWords';
import { NotificationEventing } from './Notification/NotificationEventing';
import { NotificationWrapper } from './Notification/NotificationWrapper';
import { NotificationType } from './Notification/NotificationType';
import { GuessResult } from './GuessResult';
import { DomManipulator } from '../Interfaces/DomManipulator';

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
    domManipulator: DomManipulator;

    constructor(options: GameOptions, eligibleWords: EligibleWords, messaging: NotificationEventing,
        domManipulator: DomManipulator, useTimer?: boolean) {
        this.options = options;
        this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
        this.letterState = new LetterState();
        this.userGuesses = [];
        this.startTime = new Date();
        this.eligibleWords = eligibleWords;
        this.messaging = messaging;
        this.domManipulator = domManipulator;

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
                NotificationWrapper.interpolateMessage("Exceeded max number (REPLACEMENT=>text) of guesses.", this.options.maxGuesses.toString()));

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
            this.messaging.message = new NotificationWrapper(NotificationType.Error, "Guess is not in word list.");

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
            this.messaging.message = new NotificationWrapper(NotificationType.Info, "Successful solve!");
            this.endTime = new Date();

            if (this.timerInterval !== undefined) {
                clearInterval(this.timerInterval);
            }
        } else if (this.userGuesses.length >= this.options.maxGuesses && this.endTime === undefined) {
            this.messaging.message = new NotificationWrapper(NotificationType.Error,
                NotificationWrapper.interpolateMessage("Exceeded max number (REPLACEMENT=>text) of guesses.", this.options.maxGuesses.toString()));
            this.endTime = new Date();

            if (this.timerInterval !== undefined) {
                clearInterval(this.timerInterval);
            }
        }
    }

    solved(): boolean {
        return this.userGuesses[this.userGuesses.length - 1].fullMatch;
    }

    runTimer() {
        let seconds = 0;
        let increment = 1;

        const options = this.options;
        const domManipulator = this.domManipulator;
        if (options.maxTimeLimitExists) {
            seconds = this.options.maxTimeLimit;
            increment = -1;
        }

        this.timerInterval = setInterval(function () {
            seconds += increment;
            domManipulator.paintTimer(seconds);
            if (options.maxTimeLimitExists && seconds <= 0) {
                this.messaging.message = new NotificationWrapper(NotificationType.Error,
                    NotificationWrapper.interpolateMessage("The timer has expired; the game has ended.", this.options.maxGuesses.toString()));
                this.endTime = new Date();

                clearInterval(this);
            }
        }, 1000);
    }
}