"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const TypeMoq = require("typemoq");
const gametype_1 = require("../../ProgressiveDifficultyWordle/TypeScript/Models/gametype");
const NotificationEventing_1 = require("../../ProgressiveDifficultyWordle/TypeScript/Notification/NotificationEventing");
const session_1 = require("../../ProgressiveDifficultyWordle/TypeScript/WordleAccessLayer/session");
describe("Session", () => {
    var consoleSpy;
    var answerList;
    var guessList;
    var notify;
    let gamePainterMock;
    let scoreHandlerMock;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
        answerList = ['apple'];
        guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'other', 'wrong'];
        notify = new NotificationEventing_1.NotificationEventing();
        notify.internalEventListener = function (wrapper) { };
        gamePainterMock = TypeMoq.Mock.ofType();
        scoreHandlerMock = TypeMoq.Mock.ofType();
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('initializes session with new game, when GameType is Single.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Single;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.once());
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintTimer(TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
        });
        it('initializes session with new game, when GameType is Endless.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Endless;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
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
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
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
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(6, session.state.maxGuesses);
        });
        it('initializes session with new game, when Max Guesses are explicitly specified.', () => {
            let hardMode = false;
            let maxGuesses = 5;
            let type = gametype_1.GameType.ProgressiveDifficulty;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode, maxGuesses);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(maxGuesses, session.state.maxGuesses);
        });
        it('initializes session with new game, when the Timer is enabled and a length is not explicitly specified.', () => {
            let hardMode = false;
            let maxGuesses = 5;
            let timerEnabled = true;
            let type = gametype_1.GameType.ProgressiveDifficulty;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode, maxGuesses, timerEnabled);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(maxGuesses, session.state.maxGuesses);
            assert.equal(timerEnabled, session.state.gameTimerLimitExists);
            assert.equal(600, session.state.gameTimerLength);
        });
        it('initializes session with new game, when the Timer is enabled and a length is explicitly specified.', () => {
            let hardMode = false;
            let maxGuesses = 5;
            let timerEnabled = true;
            let timerLength = 100;
            let type = gametype_1.GameType.ProgressiveDifficulty;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode, maxGuesses, timerEnabled, timerLength);
            assert.equal(true, session.isCurrentGameNew());
            assert.equal(0, session.score.totalScore);
            assert.equal(0, session.score.roundsCompleted);
            assert.equal(type, session.type);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(maxGuesses, session.state.maxGuesses);
            assert.equal(timerEnabled, session.state.gameTimerLimitExists);
            assert.equal(timerLength, session.state.gameTimerLength);
        });
    });
    describe("#next", () => {
        it('runs guesses until failure to solve when the GameType=Single and does not generate a new game after.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Single;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
            for (let i = 1; i < 6; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
            }
            session.next("wrong");
            assert.ok(!session.isCurrentGameNew());
            assert.ok(!session.state.active);
            session.next("wrong");
            assert.equal('{"messageType": "1", "message": "The session has ended. To keep playing, you will need a new session."}', consoleSpy.lastCall.lastArg);
            assert.ok(!session.state.active);
            scoreHandlerMock.verify(x => x.updateHighScores(gametype_1.GameType.Single, TypeMoq.It.isAny(), false, 6), TypeMoq.Times.once());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.exactly(7));
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.exactly(2));
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.once());
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintTimer(TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
        });
        it('runs guesses until solved to solve when the GameType=Single and does not generate a new game after.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Single;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
            for (let i = 1; i < 6; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
            }
            session.next("apple");
            assert.ok(!session.isCurrentGameNew());
            assert.ok(!session.state.active);
            session.next("apple");
            assert.equal('{"messageType": "1", "message": "The session has ended. To keep playing, you will need a new session."}', consoleSpy.lastCall.lastArg);
            assert.ok(!session.state.active);
            scoreHandlerMock.verify(x => x.updateHighScores(gametype_1.GameType.Single, TypeMoq.It.isAny(), true, 6), TypeMoq.Times.once());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.exactly(7));
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.exactly(2));
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.once());
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintTimer(TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
        });
        it('runs guesses until successful when the GameType=Endless and subsequently generate a new game, never modifying the underlying state.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Endless;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
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
            scoreHandlerMock.verify(x => x.updateHighScores(gametype_1.GameType.Endless, TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.exactly(10));
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.exactly(3));
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.exactly(3));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintTimer(TypeMoq.It.isAnyNumber()), TypeMoq.Times.never());
        });
        it('runs guesses until fails when the GameType=Endless and then don\'t generate a new game.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.Endless;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
            for (let i = 1; i <= 5; i++) {
                session.next("wrong");
                assert.ok(!session.isCurrentGameNew());
                assert.ok(session.state.active);
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
            scoreHandlerMock.verify(x => x.updateHighScores(gametype_1.GameType.Endless, TypeMoq.It.isAny()), TypeMoq.Times.once());
            session.next("apple");
            assert.equal('{"messageType": "1", "message": "The session has ended. To keep playing, you will need a new session."}', consoleSpy.lastCall.lastArg);
            assert.ok(!session.state.active);
            assert.equal(hardMode, session.state.hardMode);
            assert.equal(undefined, session.state.gameTimerLength);
            assert.equal(2, session.state.gameHistory.length);
            assert.equal(6, session.state.maxGuesses);
            assert.equal(false, session.state.gameTimerLimitExists);
        });
        it('runs guesses until successful when the GameType=ProgressiveDifficulty and subsequently generate a new game, never modifying the underlying state.', () => {
            let hardMode = false;
            let type = gametype_1.GameType.ProgressiveDifficulty;
            let session = new session_1.Session(type, answerList, guessList, notify, gamePainterMock.object, scoreHandlerMock.object, hardMode);
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
            scoreHandlerMock.verify(x => x.updateHighScores(gametype_1.GameType.ProgressiveDifficulty, TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
    });
});
//# sourceMappingURL=SessionTests.js.map