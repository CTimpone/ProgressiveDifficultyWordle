import { LetterStatus } from '../Models/LetterStatus';

export class GuessDetails {
    guess: string;
    characterStates: LetterStatus[];
    fullMatch: boolean;

    constructor(input: string, answer: string) {
        this.guess = input;
        this.characterStates = new Array<LetterStatus>(input.length);

        const answerMap = new Map<string, number[]>();
        const inputMap = new Map<string, number[]>();
        for (let i = 0; i < answer.length; i++) {
            this.buildCharacterMap(answerMap, answer, i);
            this.buildCharacterMap(inputMap, input, i);
        }

        this.populateCharacterStates(inputMap, answerMap);
        this.fullMatch = this.characterStates.every((state) => state === LetterStatus.ExactMatch);
    }

    buildCharacterMap(map: Map<string, number[]>, value: string, index: number) {
        if (!map.has(value[index])) {
            map.set(value[index], [index]);
        } else {
            map.get(value[index]).push(index);
        }
    }

    populateCharacterStates(inputMap: Map<string, number[]>, answerMap: Map<string, number[]>) {
        for (const key of inputMap.keys()) {
            const inputIndices = inputMap.get(key);

            if (answerMap.has(key)) {
                const answerIndices = answerMap.get(key);

                if (answerIndices.length >= inputIndices.length) {
                    for (const charIndex of inputIndices) {
                        this.characterStates[charIndex] = answerIndices.indexOf(charIndex) > -1 ? LetterStatus.ExactMatch : LetterStatus.WrongLocation;
                    }
                } else {
                    let exactMatchCount = 0;
                    const potentialLocationIndices = [];
                    for (const charIndex of inputIndices) {
                        if (answerIndices.indexOf(charIndex) > -1) {
                            this.characterStates[charIndex] = LetterStatus.ExactMatch;
                            exactMatchCount += 1;
                        }
                        else {
                            this.characterStates[charIndex] = LetterStatus.Absent;
                            potentialLocationIndices.push(charIndex);
                        }
                    }

                    let locationIncorrectMatches = answerIndices.length - exactMatchCount;
                    if (locationIncorrectMatches > 0) {
                        for (locationIncorrectMatches; locationIncorrectMatches > 0; locationIncorrectMatches--) {
                            this.characterStates[potentialLocationIndices.shift()] = LetterStatus.WrongLocation;
                        }
                    }

                }
            } else {
                for (const absentIndex of inputMap.get(key)) {
                    this.characterStates[absentIndex] = LetterStatus.Absent;
                }
            }
        }
    }
}