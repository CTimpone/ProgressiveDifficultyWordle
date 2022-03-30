namespace PDW {
    export class SingleGame {
        chosenWord: string;
        startTime: Date;
        endTime: Date | undefined;
        letterState: LetterState;
        userGuesses: GuessDetails[];
        options: GameOptions;

        constructor(options: GameOptions) {
            this.options = options;
            this.chosenWord = EligibleWords.EligibleAnswers[Math.floor(Math.random() * EligibleWords.EligibleAnswers.length)];
            this.letterState = new LetterState();
            this.userGuesses = [];
            this.startTime = new Date();
        }

        processGuess(input: string) {
            input = input.toLowerCase();

            let currentGuess = new GuessDetails(input, this.chosenWord);
            this.userGuesses.push(currentGuess);
            
            if (currentGuess.fullMatch || this.userGuesses.length == this.options.maxGuesses) {
                this.endTime = new Date();
            }
        }
    }
}