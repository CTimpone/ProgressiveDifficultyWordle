/// <reference path="../PDWIndex.ts" />

import assert = require('assert');
import sinon = require('sinon');
import { EligibleWords } from '../../progressivedifficultywordle/typescript/models/eligiblewords';
import { GameOptions } from '../../progressivedifficultywordle/typescript/models/gameoptions';
import { GameType } from '../../progressivedifficultywordle/typescript/models/gametype';
import { LetterStatus } from '../../progressivedifficultywordle/typescript/models/letterstatus';
import { NotificationEventing } from '../../progressivedifficultywordle/typescript/models/Notification/NotificationEventing';
import { NotificationWrapper } from '../../progressivedifficultywordle/typescript/models/Notification/NotificationWrapper';
import { Session } from '../../progressivedifficultywordle/typescript/models/session';
import { SessionState } from '../../ProgressiveDifficultyWordle/TypeScript/Models/SessionState';
import { SingleGame } from '../../progressivedifficultywordle/typescript/models/SingleGame';

describe("Session", () => {
    var consoleSpy;
    var answerList: string[];
    var guessList: string[];
    var ew: EligibleWords;
    var options: GameOptions;
    var notify: NotificationEventing;
    var game: SingleGame;
    var boardBinder: (words: string[], letterStatuses: LetterStatus[][], onlyPaintLast?: boolean) => void;

    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');

        answerList = ['apple'];
        guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'other', 'wrong'];

        ew = new EligibleWords(answerList, guessList);
        options = new GameOptions();
        notify = new NotificationEventing();
        notify.internalEventListener = function (wrapper: NotificationWrapper) { }

        game = new SingleGame(options, ew, notify);

        boardBinder = (words: string[], letterStatuses: LetterStatus[][], onlyPaintLast?: boolean) => {
            console.log(`Board binding, onlyPaintLast=${onlyPaintLast}`);
        };

    });

    afterEach(() => {
        consoleSpy.restore();
    });

    describe("#constructor", () => {
        it('initializes parameters to allow for recording state when hardMode is submitted as true.', () => {
            let hardMode = true;
            let type = GameType.Single;
            let session = new Session(type, hardMode, answerList, guessList, notify, boardBinder);

            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
        });
    });
});