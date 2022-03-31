namespace PDW {
    export class LetterState {
        ExactMatch: Map<number, string>;
        PresentBadLocations: Map<string, number[]>;
        Absent: string[];

        constructor() {
            this.Absent = [];
        }
    }
}