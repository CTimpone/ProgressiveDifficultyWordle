"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const eligiblewords_1 = require("../../progressivedifficultywordle/typescript/models/eligiblewords");
const gameoptions_1 = require("../../progressivedifficultywordle/typescript/models/gameoptions");
const gametype_1 = require("../../progressivedifficultywordle/typescript/models/gametype");
const NotificationEventing_1 = require("../../progressivedifficultywordle/typescript/models/Notification/NotificationEventing");
const session_1 = require("../../progressivedifficultywordle/typescript/models/session");
const SingleGame_1 = require("../../progressivedifficultywordle/typescript/models/SingleGame");
describe("Session", () => {
    var consoleSpy;
    var answerList;
    var guessList;
    var ew;
    var options;
    var notify;
    var game;
    var boardBinder;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
        answerList = ['apple'];
        guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'other', 'wrong'];
        ew = new eligiblewords_1.EligibleWords(answerList, guessList);
        options = new gameoptions_1.GameOptions();
        notify = new NotificationEventing_1.NotificationEventing();
        notify.internalEventListener = function (wrapper) { };
        game = new SingleGame_1.SingleGame(options, ew, notify);
        boardBinder = (words, letterStatuses, onlyPaintLast) => {
            console.log(`Board binding, onlyPaintLast=${onlyPaintLast}`);
        };
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('initializes parameters to allow for recording state when hardMode is submitted as true.', () => {
            let hardMode = true;
            let type = gametype_1.GameType.Single;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
        });
    });
});
//# sourceMappingURL=SessionTests.js.map