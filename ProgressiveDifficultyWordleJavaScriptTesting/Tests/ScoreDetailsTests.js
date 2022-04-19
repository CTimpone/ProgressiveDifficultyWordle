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
    var ew;
    var options;
    var notify;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
        let answerList = ['apple'];
        let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'other', 'wrong'];
        ew = new eligiblewords_1.EligibleWords(answerList, guessList);
        options = new gameoptions_1.GameOptions();
        notify = new NotificationEventing_1.NotificationEventing();
        notify.internalEventListener = function (wrapper) { };
        game = new singlegame_1.SingleGame(options, ew, notify);
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('initializes parameters to allow for scoring.', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);
        });
    });
    describe("#updateScore", () => {
        it('throws error if has populated endTime.', () => {
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
        it('sets endTime if individual game has ended, but was not solved.', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);
            game.options.maxGuesses = 1;
            game.finalizeGuess("wrong");
            scoreDetails.updateScore(game);
            assert.notEqual(undefined, scoreDetails.endTime);
            assert.equal(game.endTime, scoreDetails.endTime);
        });
        it('update scores to be higher when using fewer guesses.', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);
            assert.equal(6, options.maxGuesses);
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            scoreDetails.updateScore(game);
            let sixGuessScore = scoreDetails.totalScore;
            scoreDetails = new scoredetails_1.ScoreDetails();
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let fiveGuessScore = scoreDetails.totalScore;
            assert.ok(fiveGuessScore > sixGuessScore);
            scoreDetails = new scoredetails_1.ScoreDetails();
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let fourGuessScore = scoreDetails.totalScore;
            assert.ok(fourGuessScore > fiveGuessScore);
            scoreDetails = new scoredetails_1.ScoreDetails();
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let threeGuessScore = scoreDetails.totalScore;
            assert.ok(threeGuessScore > fourGuessScore);
            scoreDetails = new scoredetails_1.ScoreDetails();
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let twoGuessScore = scoreDetails.totalScore;
            assert.ok(twoGuessScore > threeGuessScore);
            scoreDetails = new scoredetails_1.ScoreDetails();
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("apple");
            let oneGuessScore = scoreDetails.totalScore;
            assert.ok(oneGuessScore > threeGuessScore);
        });
    });
});
//# sourceMappingURL=ScoreDetailsTests.js.map