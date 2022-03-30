namespace PDW {
    export class SingleGame {
        ChosenWord: string;
        StartTime: Date;
        EndTime: Date | undefined;
        LetterState: Map<string, LetterState>;
        UserGuesses: GuessDetails[];
        Options: GameOptions;
    }
}