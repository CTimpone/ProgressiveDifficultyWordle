﻿import { GuessDetails } from './GuessDetails';
import { LetterStatus } from './LetterStatus';
import { LetterState } from './LetterState';
import { GameOptions } from './GameOptions';
import { EligibleWords } from './EligibleWords';

export class SingleGame {
    chosenWord: string;
    startTime: Date;
    endTime: Date | undefined;
    letterState: LetterState;
    userGuesses: GuessDetails[];
    options: GameOptions;
    eligibleWords: EligibleWords;

    constructor(options: GameOptions, eligibleWords: EligibleWords) {
        this.options = options;
        this.chosenWord = eligibleWords.eligibleAnswers[Math.floor(Math.random() * eligibleWords.eligibleAnswers.length)];
        this.letterState = new LetterState();
        this.userGuesses = [];
        this.startTime = new Date();
        this.eligibleWords = eligibleWords;
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

    finalizeGuess(input: string): void {
        input = input.toLowerCase();

        let currentGuess = new GuessDetails(input, this.chosenWord);

        if (currentGuess.fullMatch || this.userGuesses.length === this.options.maxGuesses) {
            this.endTime = new Date();
        }

        console.log(currentGuess.characterStates);

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

        this.userGuesses.push(currentGuess);
    }
}