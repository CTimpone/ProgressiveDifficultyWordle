"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const eligiblewords_1 = require("../../progressivedifficultywordle/typescript/models/eligiblewords");
const gameoptions_1 = require("../../progressivedifficultywordle/typescript/models/gameoptions");
const singlegame_1 = require("../../progressivedifficultywordle/typescript/models/singlegame");
describe("SingleGame", () => {
    var consoleSpy;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('should choose a random word as answer from the input EligibleWords.eligibleAnswers', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            let game = new singlegame_1.SingleGame(options, ew);
            assert.notEqual(undefined, game.chosenWord);
            assert.equal(true, ew.eligibleAnswers.indexOf(game.chosenWord) !== -1);
        });
    });
});
//# sourceMappingURL=SingleGameTests.js.map