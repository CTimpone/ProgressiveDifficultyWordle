var PDW;
(function (PDW) {
    class GuessDetails {
        constructor(input, answer) {
            this.guess = input;
            this.characterStates = new Array(5);
            let answerMap = new Map();
            let inputMap = new Map();
            for (let i = 0; i < answer.length; i++) {
                this.updateCharacterMap(answerMap, answer, i);
                this.updateCharacterMap(inputMap, input, i);
            }
            console.log(inputMap);
            console.log(answerMap);
            this.populateCharacterStates(inputMap, answerMap);
            this.fullMatch = this.characterStates.every((state) => state === PDW.LetterStatus.ExactMatch);
        }
        updateCharacterMap(map, value, index) {
            if (!map.has(value[index])) {
                map.set(value[index], [index]);
            }
            else {
                map.get(value[index]).push(index);
            }
        }
        populateCharacterStates(inputMap, answerMap) {
            for (let key of inputMap.keys()) {
                let inputIndices = inputMap.get(key);
                if (answerMap.has(key)) {
                    let answerIndices = answerMap.get(key);
                    if (answerIndices.length >= inputIndices.length) {
                        for (let charIndex of inputIndices) {
                            this.characterStates[charIndex] = answerIndices.indexOf(charIndex) > -1 ? PDW.LetterStatus.ExactMatch : PDW.LetterStatus.WrongLocation;
                        }
                    }
                    else {
                        let exactMatchCount = 0;
                        let potentialLocationIndices = [];
                        for (let charIndex of inputIndices) {
                            if (answerIndices.indexOf(charIndex) > -1) {
                                this.characterStates[charIndex] = PDW.LetterStatus.ExactMatch;
                                exactMatchCount += 1;
                            }
                            else {
                                this.characterStates[charIndex] = PDW.LetterStatus.Absent;
                                potentialLocationIndices.push(charIndex);
                            }
                            let locationIncorrectMatches = answerIndices.length - exactMatchCount;
                            if (locationIncorrectMatches > 0) {
                                for (locationIncorrectMatches; locationIncorrectMatches > 0; locationIncorrectMatches--) {
                                    this.characterStates[potentialLocationIndices.shift()] = PDW.LetterStatus.WrongLocation;
                                }
                            }
                        }
                    }
                }
                else {
                    for (let absentIndex of inputMap.get(key)) {
                        this.characterStates[absentIndex] = PDW.LetterStatus.Absent;
                    }
                }
            }
        }
    }
    PDW.GuessDetails = GuessDetails;
})(PDW || (PDW = {}));
//# sourceMappingURL=guessdetails.js.map