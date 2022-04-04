"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const FiveLetterAnswers_1 = require("../../progressivedifficultywordle/typescript/Constants/Words/FiveLetterAnswers");
const FiveLetterGuesses_1 = require("../../progressivedifficultywordle/typescript/Constants/Words/FiveLetterGuesses");
const eligiblewords_1 = require("../../progressivedifficultywordle/typescript/models/eligiblewords");
describe("EligibleWords", () => {
    describe("#constructor", () => {
        it('should use the constants files to generate the guess list, answer list, and search map helper when no parameters are supplied', () => {
            let ew = new eligiblewords_1.EligibleWords();
            assert.equal(FiveLetterAnswers_1.FIVE_LETTER_ANSWERS.length, ew.eligibleAnswers.length);
            assert.equal(FiveLetterGuesses_1.FIVE_LETTER_GUESSES.length, ew.eligibleGuesses.length);
            assert.notEqual(undefined, ew.guessSearchHelper);
        });
    });
});
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});
//# sourceMappingURL=EligibleWordsTests.js.map