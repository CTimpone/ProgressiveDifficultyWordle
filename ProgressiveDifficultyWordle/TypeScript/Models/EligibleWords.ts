import { FIVE_LETTER_GUESSES } from '../Constants/Words/FiveLetterGuesses';
import { FIVE_LETTER_ANSWERS } from '../Constants/Words/FiveLetterAnswers';

export class EligibleWords {
    eligibleAnswers: string[];
    eligibleGuesses: string[];
    guessSearchHelper: Map<string, [number, number]>;

    constructor(eligibleAnswers?: string[], eligibleGuesses?: string[], letterCount = 5) {
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
                    this.eligibleAnswers = FIVE_LETTER_ANSWERS;
                    this.eligibleGuesses = FIVE_LETTER_GUESSES;
                    break;
                default:
                    throw new Error(`No word-sets configured for letterCount=${letterCount}`)
            }
        }
            
        this.buildGuessSearchHelper();
    }

    buildGuessSearchHelper(): void {
        this.guessSearchHelper = new Map<string, [number, number]>();
        for (let i = 0; i < this.eligibleGuesses.length; i++) {
            const currentLetter = this.eligibleGuesses[i][0];
            if (!this.guessSearchHelper.has(currentLetter)) {

                this.guessSearchHelper.set(currentLetter, [i, i]);

                if (i !== 0) {
                    this.guessSearchHelper.get(this.eligibleGuesses[i   - 1][0])[1] = i - 1;

                }
            }
        }

        this.guessSearchHelper.get(this.eligibleGuesses[this.eligibleGuesses.length - 1][0])[1] = this.eligibleGuesses.length - 1;
    }

    guessInWordList(target: string): boolean {
        if (!this.guessSearchHelper.has(target[0])) {
            return false;
        }

        let [start, end] = this.guessSearchHelper.get(target[0]);
        console.log(start);
        console.log(end);
        while (start <= end) {
            const midPoint = start + Math.floor((end - start) / 2);
            const midVal = this.eligibleGuesses[midPoint];

            if (midVal === target) {
                return true;
            } else if (midVal > target) {
                end = midPoint - 1;
            } else {
                start = midPoint + 1
            }
        }
        return false;
    }
}