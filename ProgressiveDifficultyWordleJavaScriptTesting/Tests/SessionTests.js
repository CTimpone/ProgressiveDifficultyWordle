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
        it('initializes session with new game, when GameType is Single.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Single;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
        });
        it('initializes session with new game, when GameType is Endless.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Endless;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
        });
        it('initializes session with new game, when GameType is ProgressiveDifficulty.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.ProgressiveDifficulty;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
        });
        it('initializes session with new game, when Hard Mode is enabled.', () => {
            let hardMode = true;
            let type = gametype_1.GameType.ProgressiveDifficulty;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
        });
    });
    describe("#next", () => {
        it('runs guesses until failure to solve when the GameType=Single and does not generate a new game after.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Single;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            for (let i = 1; i < 6; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
                assert.equal("Board binding, onlyPaintLast=false", consoleSpy.lastCall.lastArg);
            }
            session.next("wrong");
            assert.ok(!session.isCurrentGameNew());
            assert.ok(!session.state.active);
            session.next("wrong");
            assert.equal('{"messageType": "1", "message": "The session has ended. To keep playing, you will need a new session."}', consoleSpy.lastCall.lastArg);
            assert.ok(!session.state.active);
        });
    });
    describe("#next", () => {
        it('runs guesses until solved to solve when the GameType=Single and does not generate a new game after.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Single;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            for (let i = 1; i < 6; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
                assert.equal("Board binding, onlyPaintLast=false", consoleSpy.lastCall.lastArg);
            }
            session.next("apple");
            assert.ok(!session.isCurrentGameNew());
            assert.ok(!session.state.active);
            session.next("apple");
            assert.equal('{"messageType": "1", "message": "The session has ended. To keep playing, you will need a new session."}', consoleSpy.lastCall.lastArg);
            assert.ok(!session.state.active);
        });
    });
    describe("#next", () => {
        it('runs guesses until successful when the GameType=Endless and subsequently generate a new game, never modifying the underlying state.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Endless;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(true, session.state.active);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(0, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
            for (let i = 1; i <= 5; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
                assert.equal("Board binding, onlyPaintLast=false", consoleSpy.lastCall.lastArg);
            }
            session.next("apple");
            assert.ok(session.state.active);
            assert.ok(session.isCurrentGameNew());
            assert.equal(1, session.score.roundsCompleted);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(true, session.state.active);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(1, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
            session.next("apple");
            assert.ok(session.state.active);
            assert.ok(session.isCurrentGameNew());
            assert.equal(2, session.score.roundsCompleted);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(true, session.state.active);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(2, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
        });
    });
    describe("#next", () => {
        it('runs guesses until fails when the GameType=Endless and then don\'t generate a new game.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Endless;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            for (let i = 1; i <= 5; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
                assert.equal("Board binding, onlyPaintLast=false", consoleSpy.lastCall.lastArg);
            }
            session.next("apple");
            assert.ok(session.state.active);
            assert.ok(session.isCurrentGameNew());
            assert.equal(1, session.score.roundsCompleted);
            session.next("apple");
            assert.ok(session.state.active);
            assert.ok(session.isCurrentGameNew());
            assert.equal(2, session.score.roundsCompleted);
            for (let i = 1; i <= 6; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.equal(i < 6, session.state.active);
            }
            session.next("apple");
            assert.equal('{"messageType": "1", "message": "The session has ended. To keep playing, you will need a new session."}', consoleSpy.lastCall.lastArg);
            assert.ok(!session.state.active);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(2, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
        });
    });
    describe("#next", () => {
        it('runs guesses until successful when the GameType=ProgressiveDifficulty and subsequently generate a new game, never modifying the underlying state.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.ProgressiveDifficulty;
            let session = new session_1.Session(type, hardMode, answerList, guessList, notify, boardBinder);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(true, session.state.active);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(0, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
            for (let i = 1; i <= 5; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
                assert.equal("Board binding, onlyPaintLast=false", consoleSpy.lastCall.lastArg);
            }
            session.next("apple");
            assert.ok(session.state.active);
            assert.ok(session.isCurrentGameNew());
            assert.equal(1, session.score.roundsCompleted);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(true, session.state.active);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(1, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
            session.next("apple");
            assert.ok(session.state.active);
            assert.ok(session.isCurrentGameNew());
            assert.equal(2, session.score.roundsCompleted);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(true, session.state.active);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(2, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
            session.next("apple");
            assert.ok(session.state.active);
            assert.ok(session.isCurrentGameNew());
            assert.equal(3, session.score.roundsCompleted);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(true, session.state.active);
            assert.equal(600, session.state.gameTimerLength);
            assert.equal(3, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(true, session.state.gameTimerLimitExists);
        });
    });
});
//# sourceMappingURL=SessionTests.js.map