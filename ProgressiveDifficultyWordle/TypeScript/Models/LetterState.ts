namespace PDW {
    export class LetterState {
        ExactMatch: Map<number, string>;
        PresentBadLocations: Map<string, number[]>;
        Absent: string[];

        constructor() {
            this.ExactMatch = new Map<number, string>();
            this.PresentBadLocations = new Map<string, number[]>();
            this.Absent = [];
        }
    }
}