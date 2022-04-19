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
    var game;

    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');

        let answerList = ['apple'];
        let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'other', 'wrong'];

        let ew = new EligibleWords(answerList, guessList);
        let options = new GameOptions();
        let notify = new NotificationEventing();
        notify.internalEventListener = function (wrapper: NotificationWrapper) {
            assert.fail("No notification should occur");
        }

        game = new SingleGame(options, ew, notify);

    });

    afterEach(() => {
        consoleSpy.restore();
    });

    describe("#constructor", () => {
        it('initializes parameters to allow for scoring', () => {
            let scoreDetails = new ScoreDetails();
            assert.equal(undefined, scoreDetails.endTime);
            assert.equal(0, scoreDetails.roundsCompleted);
            assert.equal(0, scoreDetails.startingGuesses.size);
            assert.equal(0, scoreDetails.totalScore);
        });
    });

    describe("#updateScore", () => {
        it('throws error if has populated endTime', () => {
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
    });

});