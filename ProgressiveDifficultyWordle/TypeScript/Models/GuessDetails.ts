namespace PDW {
    export class GuessDetails {
        guess: string;
        characterStates: LetterStatus[];
        fullMatch: boolean;

        constructor(input: string, answer: string) {
            this.guess = input;
            this.characterStates = new Array<LetterStatus>(5);

            let answerMap = new Map<string, number[]>();
            let inputMap = new Map<string, number[]>();
            for (let i = 0; i < answer.length; i++) {
                this.updateCharacterMap(answerMap, answer, i);
                this.updateCharacterMap(inputMap, input, i);
            }

            console.log(inputMap);
            console.log(answerMap);
            this.populateCharacterStates(inputMap, answerMap);

            this.fullMatch = this.characterStates.every((state) => state === LetterStatus.ExactMatch);
        }

        private updateCharacterMap(map: Map<string, number[]>, value: string, index: number) {
            if (!map.has(value[index])) {
                map.set(value[index], [index]);
            } else {
                map.get(value[index]).push(index);
            }
        }

        private populateCharacterStates(inputMap: Map<string, number[]>, answerMap: Map<string, number[]>) {
            for (let key of inputMap.keys()) {
                let inputIndices = inputMap.get(key);

                if (answerMap.has(key)) {
                    let answerIndices = answerMap.get(key);

                    if (answerIndices.length >= inputIndices.length) {
                        for (let charIndex of inputIndices) {
                            this.characterStates[charIndex] = answerIndices.indexOf(charIndex) > -1 ? LetterStatus.ExactMatch : LetterStatus.WrongLocation;
                        }
                    } else {
                        let exactMatchCount = 0;
                        let potentialLocationIndices = [];
                        for (let charIndex of inputIndices) {
                            if (answerIndices.indexOf(charIndex) > -1) {
                                this.characterStates[charIndex] = LetterStatus.ExactMatch;
                                exactMatchCount += 1;
                            }
                            else {
                                this.characterStates[charIndex] = LetterStatus.Absent;
                                potentialLocationIndices.push(charIndex);
                            }

                            let locationIncorrectMatches = answerIndices.length - exactMatchCount;
                            if (locationIncorrectMatches > 0) {
                                for (locationIncorrectMatches; locationIncorrectMatches > 0; locationIncorrectMatches--) {
                                    this.characterStates[potentialLocationIndices.shift()] = LetterStatus.WrongLocation;
                                }
                            }

                        }
                    }
                } else {
                    for (let absentIndex of inputMap.get(key)) {
                        this.characterStates[absentIndex] = LetterStatus.Absent;
                    }
                }
            }
        }

    }
}