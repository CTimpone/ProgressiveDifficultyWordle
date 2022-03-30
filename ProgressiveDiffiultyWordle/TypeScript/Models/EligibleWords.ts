namespace PDW {
    export class EligibleWords {
        static EligibleAnswers: string[];
        static EligibleGuesses: string[];
        static GuessSearchHelper: Map<string, [number, number]>;
        static readonly ValidCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; 
    }
}