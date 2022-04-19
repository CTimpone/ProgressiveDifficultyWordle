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

        it('update scores to be higher when using fewer guesses.', () => {
            let scoreDetails = new ScoreDetails();
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

            scoreDetails = new ScoreDetails();
            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");

            let fiveGuessScore = scoreDetails.totalScore;

            assert.ok(fiveGuessScore > sixGuessScore);

            scoreDetails = new ScoreDetails();
            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");

            let fourGuessScore = scoreDetails.totalScore;

            assert.ok(fourGuessScore > fiveGuessScore);

            scoreDetails = new ScoreDetails();
            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");

            let threeGuessScore = scoreDetails.totalScore;

            assert.ok(threeGuessScore > fourGuessScore);

            scoreDetails = new ScoreDetails();
            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("wrong");
            game.finalizeGuess("apple");

            let twoGuessScore = scoreDetails.totalScore;

            assert.ok(twoGuessScore > threeGuessScore);

            scoreDetails = new ScoreDetails();
            game = new SingleGame(options, ew, notify);
            game.finalizeGuess("apple");

            let oneGuessScore = scoreDetails.totalScore;

            assert.ok(oneGuessScore > threeGuessScore);

        });


    });

});