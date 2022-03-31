namespace PDW {
    export class EligibleWords {
        eligibleAnswers: string[];
        eligibleGuesses: string[];
        guessSearchHelper: Map<string, [number, number]>;

        constructor(letterCount = 5) {
            switch (letterCount) {
                case 5:
                    this.eligibleAnswers = FIVE_LETTER_ANSWERS;
                    this.eligibleGuesses = FIVE_LETTER_GUESSES;
                    break;
                default:
                    throw new Error(`No word-sets configured for ${letterCount}`)
            }


            this.buildGuessSearchHelper();
        }

        buildGuessSearchHelper(): void {
            this.guessSearchHelper = new Map<string, [number, number]>();
            for (let i = 0; i < this.eligibleGuesses.length; i++) {
                let currentLetter = this.eligibleGuesses[i][0];
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
            let [start, end] = this.guessSearchHelper.get(target[0]);
            console.log(start);
            console.log(end);
            while (start <= end) {
                let midPoint = start + Math.floor((end - start) / 2);
                let midVal = this.eligibleGuesses[midPoint];

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
}