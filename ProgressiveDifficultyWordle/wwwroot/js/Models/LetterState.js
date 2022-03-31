var PDW;
(function (PDW) {
    class LetterState {
        constructor() {
            this.ExactMatch = new Map();
            this.PresentBadLocations = new Map();
            this.Absent = [];
        }
    }
    PDW.LetterState = LetterState;
})(PDW || (PDW = {}));
//# sourceMappingURL=LetterState.js.map