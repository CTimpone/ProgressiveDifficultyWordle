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
    });
    describe("#calculateRoundScore", () => {
        it('generates the same score when multiple follow the same guess pattern (with different starting words).', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");
            let scoreOne = scoreDetails.calculateRoundScore(game);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("abhor");
            game.finalizeGuess("apple");
            let scoreTwo = scoreDetails.calculateRoundScore(game);
            assert.equal(scoreOne, scoreTwo);
        });
        it('generates a higher score when fewer guesses are used to solve when starting words differ.', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            assert.equal(6, options.maxGuesses);
            game.finalizeGuess("abbot");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let sixGuessScore = scoreDetails.calculateRoundScore(game);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("abhor");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let fiveGuessScore = scoreDetails.calculateRoundScore(game);
            assert.ok(fiveGuessScore > sixGuessScore);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("abide");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let fourGuessScore = scoreDetails.calculateRoundScore(game);
            assert.ok(fourGuessScore > fiveGuessScore);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("abode");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let threeGuessScore = scoreDetails.calculateRoundScore(game);
            assert.ok(threeGuessScore > fourGuessScore);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("other");
            game.finalizeGuess("apple");
            let twoGuessScore = scoreDetails.calculateRoundScore(game);
            assert.ok(twoGuessScore > threeGuessScore);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("apple");
            let oneGuessScore = scoreDetails.calculateRoundScore(game);
            assert.ok(oneGuessScore > threeGuessScore);
        });
        it('generates a higher score when using an original starting guesses, but both use the same number of guesses.', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");
            let originalStarter = scoreDetails.calculateRoundScore(game);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");
            let duplicateStarter = scoreDetails.calculateRoundScore(game);
            assert.ok(originalStarter > duplicateStarter);
        });
        it('generates a higher score when equivalent guess patterns (with differing starters), but it was solved a minute faster.', () => {
            let scoreDetails = new scoredetails_1.ScoreDetails();
            let baseDate = new Date();
            let baseDatePlusOne = new Date(baseDate.getTime() + 60000);
            let baseDatePlusTwo = new Date(baseDate.getTime() + 120000);
            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");
            game.startTime = baseDate;
            game.endTime = baseDatePlusOne;
            let oneMinuteSolve = scoreDetails.calculateRoundScore(game);
            game = new singlegame_1.SingleGame(options, ew, notify);
            game.finalizeGuess("abhor");
            game.finalizeGuess("apple");
            game.startTime = baseDate;
            game.endTime = baseDatePlusTwo;
            let twoMinuteSolve = scoreDetails.calculateRoundScore(game);
            assert.ok(oneMinuteSolve > twoMinuteSolve);
        });
    });
});
//# sourceMappingURL=ScoreDetailsTests.js.map