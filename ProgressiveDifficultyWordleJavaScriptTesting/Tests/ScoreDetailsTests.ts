/// <reference path="../PDWIndex.ts" />

import assert = require('assert');
import sinon = require('sinon');
import { EligibleWords } from '../../progressivedifficultywordle/typescript/models/eligiblewords';
import { GameOptions } from '../../progressivedifficultywordle/typescript/models/gameoptions';
import { NotificationEventing } from '../../progressivedifficultywordle/typescript/models/Notification/NotificationEventing';
import { NotificationWrapper } from '../../progressivedifficultywordle/typescript/models/Notification/NotificationWrapper';
import { ScoreDetails } from '../../progressivedifficultywordle/typescript/models/scoredetails';
import { SingleGame } from '../../progressivedifficultywordle/typescript/models/singlegame';

describe("ScoreDetails", () => {
    var consoleSpy;
    var game: SingleGame;
    var ew: EligibleWords;
    var options: GameOptions;
    var notify: NotificationEventing;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');

        let answerList = ['apple'];
        let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'other', 'wrong'];

        ew = new EligibleWords(answerList, guessList);
        options = new GameOptions();
        notify = new NotificationEventing();
        notify.internalEventListener = function (wrapper: NotificationWrapper) { }

        game = new SingleGame(options, ew, notify);

    });

    afterEach(() => {
        consoleSpy.restore();
    });

    describe("#constructor", () => {
        it('initializes parameters to allow for scoring.', () => {
            let scoreDetails = new ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);
        });
    });

    describe("#updateScore", () => {
        it('throws error if has populated endTime.', () => {
            let scoreDetails = new ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);

            scoreDetails.endTime = new Date();
            try {
                scoreDetails.updateScore(game);
            }
            catch (error: unknown) {
                let trueError = error as Error;
                assert.equal("Cannot update score when not active.", trueError.message);
            }
        });

        it('sets endTime if individual game has ended, but was not solved.', () => {
            let scoreDetails = new ScoreDetails();
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

        it('increments roundsCompleted when the game is solved.', () => {
            let scoreDetails = new ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);

            game.options.maxGuesses = 1;
            game.finalizeGuess("apple");

            const initialRounds = scoreDetails.roundsCompleted;
            scoreDetails.updateScore(game);

            assert.equal(initialRounds + 1, scoreDetails.roundsCompleted);
        });

        it('increments totalScore when the game is solved.', () => {
            let scoreDetails = new ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);

            game.options.maxGuesses = 1;
            game.finalizeGuess("apple");

            const initialScore = scoreDetails.totalScore;
            scoreDetails.updateScore(game);
            scoreDetails.startingGuesses = new Set<string>();
            assert.equal(initialScore + scoreDetails.calculateRoundScore(game), scoreDetails.totalScore);
        });

        it('totalScore increases additionally as more games are solved successfully.', () => {
            let scoreDetails = new ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);

            game.options.maxGuesses = 1;
            game.finalizeGuess("apple");

            const initialScore = scoreDetails.totalScore;
            scoreDetails.updateScore(game);
            scoreDetails.startingGuesses = new Set<string>();
            const scoreAfterOne = scoreDetails.totalScore;
            scoreDetails.updateScore(game);
            scoreDetails.startingGuesses = new Set<string>();
            const scoreAfterTwo = scoreDetails.totalScore;
            scoreDetails.updateScore(game);
            scoreDetails.startingGuesses = new Set<string>();
            const scoreAfterThree = scoreDetails.totalScore;

            const roundScore = scoreDetails.calculateRoundScore(game);

            assert.equal(initialScore + roundScore, scoreAfterOne);
            assert.ok(scoreAfterOne + roundScore < scoreAfterTwo);
            assert.ok(scoreAfterTwo - scoreAfterOne < scoreAfterThree - scoreAfterTwo);

        });
    });

    describe("#calculateRoundScore", () => {
        it('generates the same score when multiple follow the same guess pattern (with different starting words).', () => {
            let scoreDetails = new ScoreDetails();

            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");
            let scoreOne = scoreDetails.calculateRoundScore(game);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("abhor");
            game.finalizeGuess("apple");

            let scoreTwo = scoreDetails.calculateRoundScore(game);

            assert.equal(scoreOne, scoreTwo);

        });

        it('generates a higher score when fewer guesses are used to solve when starting words differ.', () => {
            let scoreDetails = new ScoreDetails();

            assert.equal(6, options.maxGuesses);
            game.finalizeGuess("abbot");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");
            let sixGuessScore = scoreDetails.calculateRoundScore(game);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("abhor");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");

            let fiveGuessScore = scoreDetails.calculateRoundScore(game);

            assert.ok(fiveGuessScore > sixGuessScore);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("abide");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");

            let fourGuessScore = scoreDetails.calculateRoundScore(game);

            assert.ok(fourGuessScore > fiveGuessScore);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("abode");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");

            let threeGuessScore = scoreDetails.calculateRoundScore(game);

            assert.ok(threeGuessScore > fourGuessScore);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("other");
            game.finalizeGuess("apple");

            let twoGuessScore = scoreDetails.calculateRoundScore(game);

            assert.ok(twoGuessScore > threeGuessScore);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("apple");

            let oneGuessScore = scoreDetails.calculateRoundScore(game);

            assert.ok(oneGuessScore > threeGuessScore);

        });

        it('generates a higher score when using an original starting guesses, but both use the same number of guesses.', () => {
            let scoreDetails = new ScoreDetails();

            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");

            let originalStarter = scoreDetails.calculateRoundScore(game);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");

            let duplicateStarter = scoreDetails.calculateRoundScore(game);

            assert.ok(originalStarter > duplicateStarter);
        });

        it('generates a higher score when equivalent guess patterns (with differing starters), but it was solved a minute faster.', () => {
            let scoreDetails = new ScoreDetails();
            let baseDate = new Date();
            let baseDatePlusOne = new Date(baseDate.getTime() + 60000);
            let baseDatePlusTwo = new Date(baseDate.getTime() + 120000);


            game.finalizeGuess("abbot");
            game.finalizeGuess("apple");
            game.startTime = baseDate;
            game.endTime = baseDatePlusOne;

            let oneMinuteSolve = scoreDetails.calculateRoundScore(game);

            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("abhor");
            game.finalizeGuess("apple");

            game.startTime = baseDate;
            game.endTime = baseDatePlusTwo;

            let twoMinuteSolve = scoreDetails.calculateRoundScore(game);

            assert.ok(oneMinuteSolve > twoMinuteSolve);
        });

    });
});