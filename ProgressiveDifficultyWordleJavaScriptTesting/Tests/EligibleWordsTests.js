"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
//import {  } from '../../progressivedifficultywordle/typescript/Constants/Words/FiveLetterAnswers';
//import { FIVE_LETTER_GUESSES } from '../../progressivedifficultywordle/typescript/Constants/Words/FiveLetterGuesses';
//import * as PDW from '../../progressivedifficultywordle/typescript/models/eligiblewords';
describe("EligibleWords", () => {
    describe("#constructor", () => {
        it('should use the constants files to generate the guess list, answer list, and search map helper when no parameters are supplied', () => {
            //let ew = new PDW.EligibleWords(undefined, undefined, 5);
            //assert.equal(FIVE_LETTER_ANSWERS.length, ew.eligibleAnswers.length);
            //assert.equal(FIVE_LETTER_GUESSES.length, ew.eligibleGuesses.length);
            //assert.notEqual(undefined, ew.guessSearchHelper);
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