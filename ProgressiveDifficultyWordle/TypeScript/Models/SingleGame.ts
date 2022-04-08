import { GuessDetails } from './GuessDetails';
import { LetterStatus } from './LetterStatus';
import { LetterState } from './LetterState';
import { GameOptions } from './GameOptions';
import { EligibleWords } from './EligibleWords';
import { NotificationEventing } from './Notification/NotificationEventing';
import { NotificationWrapper } from './Notification/NotificationWrapper';
import { NotificationType } from './Notification/NotificationType';

export class SingleGame {
    chosenWord: string;
    startTime: Date;
    endTime: Date | undefined;
    letterState: LetterState;
    userGuesses: GuessDetails[];
    options: GameOptions;
    eligibleWords: EligibleWords;
    messaging: NotificationEventing;

    constructor(options: GameOptions, eligibleWords: EligibleWords, messaging: NotificationEventing) {
        this.options = options;
        this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
        this.letterState = new LetterState();
        this.userGuesses = [];
        this.startTime = new Date();
        this.eligibleWords = eligibleWords;
        this.messaging = messaging;
    }

    guessTrigger(input: string): boolean {
        input = input.toLowerCase();

        if (this.validateGuess(input)) {
            this.finalizeGuess(input);
        }

        return this.endTime !== undefined;
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

        let inputRegex = /[a-z]/g;
        let match = input.match(inputRegex);
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
        let currentGuess = new GuessDetails(input, this.chosenWord);
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

        if (currentGuess.fullMatch) {
            this.messaging.message = new NotificationWrapper(NotificationType.Info, "Successful solve!");
            this.endTime = new Date();
        } else if (this.userGuesses.length >= this.options.maxGuesses && this.endTime === undefined) {
            this.messaging.message = new NotificationWrapper(NotificationType.Error,
                NotificationWrapper.interpolateMessage("Exceeded max number (REPLACEMENT=>text) of guesses.", this.options.maxGuesses.toString()));
            this.endTime = new Date();
        }

    }
}