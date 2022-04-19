"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const eligiblewords_1 = require("../../progressivedifficultywordle/typescript/models/eligiblewords");
const gameoptions_1 = require("../../progressivedifficultywordle/typescript/models/gameoptions");
const NotificationEventing_1 = require("../../progressivedifficultywordle/typescript/models/Notification/NotificationEventing");
const scoredetails_1 = require("../../progressivedifficultywordle/typescript/models/scoredetails");
const singlegame_1 = require("../../progressivedifficultywordle/typescript/models/singlegame");
describe("ScoreDetails", () => {
    var consoleSpy;
    var game;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
        let answerList = ['apple'];
        let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'other', 'wrong'];
        let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
        let options = new gameoptions_1.GameOptions();
        let notify = new NotificationEventing_1.NotificationEventing();
        notify.internalEventListener = function (wrapper) {
            assert.fail("No notification should occur");
        };
        game = new singlegame_1.SingleGame(options, ew, notify);
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('initializes parameters to allow for scoring', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);
        });
    });
    describe("#updateScore", () => {
        it('throws error if has populated endTime', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);
            scoreDetails.endTime = new Date();
            try {
                scoreDetails.updateScore(game);
            }
            catch (error) {
                let trueError = error;
                assert.equal("Cannot update score when not active.", trueError.message);
            }
        });
    });
});
//# sourceMappingURL=ScoreDetailsTests.js.map