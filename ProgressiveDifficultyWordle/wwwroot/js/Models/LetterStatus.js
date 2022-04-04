var PDW;
(function (PDW) {
    let LetterStatus;
    (function (LetterStatus) {
        LetterStatus[LetterStatus["Unknown"] = 0] = "Unknown";
        LetterStatus[LetterStatus["ExactMatch"] = 1] = "ExactMatch";
        LetterStatus[LetterStatus["WrongLocation"] = 2] = "WrongLocation";
        LetterStatus[LetterStatus["Absent"] = 3] = "Absent";
    })(LetterStatus = PDW.LetterStatus || (PDW.LetterStatus = {}));
})(PDW || (PDW = {}));
//# sourceMappingURL=LetterStatus.js.map