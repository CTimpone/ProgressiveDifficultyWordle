"use strict";
/// <reference path="../PDWIndex.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const TypeMoq = require("typemoq");
const eligiblewords_1 = require("../../ProgressiveDifficultyWordle/TypeScript/WordleAccessLayer/eligiblewords");
const gameoptions_1 = require("../../ProgressiveDifficultyWordle/TypeScript/models/gameoptions");
const GuessDetails_1 = require("../../ProgressiveDifficultyWordle/TypeScript/WordleAccessLayer/GuessDetails");
const NotificationEventing_1 = require("../../ProgressiveDifficultyWordle/TypeScript/Notification/NotificationEventing");
const NotificationType_1 = require("../../ProgressiveDifficultyWordle/TypeScript/Models/NotificationType");
const singlegame_1 = require("../../ProgressiveDifficultyWordle/TypeScript/WordleAccessLayer/singlegame");
describe("SingleGame", () => {
    var consoleSpy;
    var notify;
    let gamePainterMock;
    let game;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
        notify = new NotificationEventing_1.NotificationEventing();
        gamePainterMock = TypeMoq.Mock.ofType();
    });
    afterEach(() => {
        consoleSpy.restore();
        game.stopTimer();
    });
    describe("#constructor", () => {
        it('should choose a random word as answer from the input EligibleWords eligibleAnswers', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.registerListener(function (wrapper) {
                assert.fail("No notification should occur");
            });
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            assert.notEqual(undefined, game.chosenWord);
            assert.equal(true, ew.eligibleAnswers.indexOf(game.chosenWord) !== -1);
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintTimer(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should continuously paint the timer when the parameter is set as true', () => __awaiter(void 0, void 0, void 0, function* () {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.registerListener(function (wrapper) {
                assert.fail("No notification should occur");
            });
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, true);
            yield new Promise(r => setTimeout(r, 1100));
            assert.notEqual(undefined, game.chosenWord);
            assert.equal(true, ew.eligibleAnswers.indexOf(game.chosenWord) !== -1);
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintTimer(TypeMoq.It.isAnyNumber()), TypeMoq.Times.atLeastOnce());
        }));
    });
    describe("#validateGuess", () => {
        it('should return true if the game is active, not configured for hard-mode, and is in the guess list.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            assert.equal(true, game.validateGuess("abbot"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('does not update the game\'s userGuesses list regardless of whether the guess is valid or invalid.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) { };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            assert.equal(true, game.validateGuess("abbot"));
            assert.equal(0, game.userGuesses);
            assert.equal(false, game.validateGuess("abuzz"));
            assert.equal(0, game.userGuesses);
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return false if the game has ended.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("The game has already ended.", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            game.endTime = new Date();
            assert.equal(false, game.validateGuess("wrong"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return false if the user has already submitted guesses equal to the configured max guesses.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(false, 1);
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("Exceeded max number 1 of guesses.", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            game.userGuesses.push(new GuessDetails_1.GuessDetails("other", game.chosenWord));
            assert.equal(game.options.maxGuesses, game.userGuesses.length);
            assert.equal(false, game.validateGuess("wrong"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return false if the user has already submitted guesses greater than the configured max guesses.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(false, 1);
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("Exceeded max number 1 of guesses.", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            game.userGuesses.push(new GuessDetails_1.GuessDetails("other", game.chosenWord));
            game.userGuesses.push(new GuessDetails_1.GuessDetails("again", game.chosenWord));
            assert.ok(game.options.maxGuesses < game.userGuesses.length);
            assert.equal(false, game.validateGuess("wrong"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return false if the input is not all lower-case letters.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("Invalid input.", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            assert.equal(false, game.validateGuess("WRONG"));
            assert.equal(false, game.validateGuess("WRoNG"));
            assert.equal(false, game.validateGuess("wrOng"));
            assert.equal(false, game.validateGuess("!rong"));
            assert.equal(false, game.validateGuess("wr0ng"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return false if the input does not match the length of the answer.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("Invalid input.", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            assert.equal(false, game.validateGuess("abbo"));
            assert.equal(false, game.validateGuess("abho"));
            assert.equal(false, game.validateGuess("abid"));
            assert.equal(false, game.validateGuess("ab"));
            assert.equal(false, game.validateGuess("appple"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return false if the game is configured for hard-mode, and the guess does not have all completely known characters present.', () => {
            let answerList = ['abhor'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(true);
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("Hard mode rules violated: 'b' must be present at character index 1 of 4.", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            game.letterState.ExactMatch.set(0, 'a');
            game.letterState.ExactMatch.set(1, 'b');
            game.letterState.ExactMatch.set(2, 'h');
            assert.equal(false, game.validateGuess("apple"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return true if the game is configured for hard-mode, and the guess does have all completely known characters present, but ignores characters known to be present, but not the exact location.', () => {
            let answerList = ['abode'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'abuzz'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(true);
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            game.letterState.ExactMatch.set(0, 'a');
            game.letterState.ExactMatch.set(1, 'b');
            game.letterState.PresentBadLocations.set('o', [3]);
            assert.equal(true, game.validateGuess("abuzz"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should return false if the guess is not in the EligibleWords eligibleGuesses list.', () => {
            let answerList = ['abhor'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(true);
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("'ABUZZ' is not in word list.", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            game.letterState.ExactMatch.set(0, 'a');
            game.letterState.ExactMatch.set(1, 'b');
            assert.equal(false, game.validateGuess("abuzz"));
            assert.equal(-1, game.eligibleWords.eligibleGuesses.indexOf("abuzz"));
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
    });
    describe("#finalizeGuess", () => {
        it('should set endTime when the guess matches chosenWord.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Info, wrapper.type);
                assert.equal("Successful solve - 'APPLE'!", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = game.chosenWord;
            game.finalizeGuess(guess);
            assert.notEqual(undefined, game.endTime);
            assert.ok(new Date() >= game.endTime);
            assert.equal(1, game.userGuesses.length);
            assert.equal(true, game.userGuesses[game.userGuesses.length - 1].fullMatch);
            for (let index of game.letterState.ExactMatch.keys()) {
                assert.equal(game.letterState.ExactMatch.get(index), guess[index]);
            }
            assert.equal(0, game.letterState.Absent.length);
            assert.equal(0, game.letterState.PresentBadLocations.size);
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should set endTime when a number of guesses surpasses gameOptions configured value regardless of being correct.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(false, 1);
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("Exceeded max number 1 of guesses; the correct answer was 'APPLE'", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = game.eligibleWords.eligibleGuesses[0];
            game.finalizeGuess(guess);
            assert.equal(1, game.userGuesses.length);
            assert.equal(false, game.userGuesses[0].fullMatch);
            assert.notEqual(undefined, game.endTime);
            assert.ok(new Date() >= game.endTime);
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('should add each guess to the userGuesses array until the game has ended.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.equal(NotificationType_1.NotificationType.Error, wrapper.type);
                assert.equal("Exceeded max number 6 of guesses; the correct answer was 'APPLE'", wrapper.message);
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = game.eligibleWords.eligibleGuesses[0];
            for (let i = 1; i <= game.options.maxGuesses; i++) {
                game.finalizeGuess(guess);
                assert.equal(i, game.userGuesses.length);
                assert.equal(false, game.userGuesses[i - 1].fullMatch);
                if (i === game.options.maxGuesses) {
                    assert.notEqual(undefined, game.endTime);
                    assert.ok(new Date() >= game.endTime);
                }
                else {
                    assert.equal(undefined, game.endTime);
                }
            }
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('populates letter states properly when all characters in input are absent.', () => {
            let answerList = ['abbot'];
            let guessList = ['abbot', 'risen'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = 'risen';
            game.finalizeGuess(guess);
            assert.equal(5, game.letterState.Absent.length);
            for (let char of guess) {
                assert.ok(game.letterState.Absent.indexOf(char) !== -1);
            }
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('does not duplicate population of absent characters in letterState across guesses.', () => {
            let answerList = ['abbot'];
            let guessList = ['abbot', 'risen', 'sense'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = 'risen';
            game.finalizeGuess(guess);
            assert.equal(5, game.letterState.Absent.length);
            for (let char of guess) {
                assert.ok(game.letterState.Absent.indexOf(char) !== -1);
            }
            guess = 'sense';
            game.finalizeGuess(guess);
            assert.equal(5, game.letterState.Absent.length);
            for (let char of guess) {
                assert.ok(game.letterState.Absent.indexOf(char) !== -1);
            }
        });
        it('does not reset population of absent characters in letterState when not all letters are shared between guesses.', () => {
            let answerList = ['abbot'];
            let guessList = ['abbot', 'nymph', 'risen'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = 'risen';
            game.finalizeGuess(guess);
            assert.equal(5, game.letterState.Absent.length);
            for (let char of guess) {
                assert.ok(game.letterState.Absent.indexOf(char) !== -1);
            }
            guess = 'nymph';
            game.finalizeGuess(guess);
            assert.equal(9, game.letterState.Absent.length);
            for (let char of guess) {
                assert.ok(game.letterState.Absent.indexOf(char) !== -1);
            }
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('populates letter states properly when all characters in present but in the wrong location.', () => {
            let answerList = ['alert'];
            let guessList = ['alert', 'later'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = 'later';
            game.finalizeGuess(guess);
            assert.equal(5, game.letterState.PresentBadLocations.size);
            for (let char of game.letterState.PresentBadLocations.keys()) {
                assert.equal(guess.indexOf(char), game.letterState.PresentBadLocations.get(char)[0]);
            }
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('does not reset or modify existing wrong location letter state data on subsequent guesses.', () => {
            let answerList = ['alert'];
            let guessList = ['alert', 'later', 'nymph'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = 'later';
            game.finalizeGuess(guess);
            assert.equal(5, game.letterState.PresentBadLocations.size);
            for (let char of game.letterState.PresentBadLocations.keys()) {
                assert.equal(guess.indexOf(char), game.letterState.PresentBadLocations.get(char)[0]);
            }
            let guessTwo = 'nymph';
            game.finalizeGuess(guessTwo);
            assert.equal(5, game.letterState.Absent.length);
            for (let char of guessTwo) {
                assert.ok(game.letterState.Absent.indexOf(char) !== -1);
            }
            assert.equal(5, game.letterState.PresentBadLocations.size);
            for (let char of game.letterState.PresentBadLocations.keys()) {
                assert.equal(guess.indexOf(char), game.letterState.PresentBadLocations.get(char)[0]);
            }
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('updates letter state wrong location with multiple values when both guess and answer have same count.', () => {
            let answerList = ['naval'];
            let guessList = ['aorta', 'naval'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = 'aorta';
            game.finalizeGuess(guess);
            assert.equal(1, game.letterState.PresentBadLocations.size);
            for (let char of game.letterState.PresentBadLocations.keys()) {
                for (let index of game.letterState.PresentBadLocations.get(char)) {
                    assert.equal(char, guess[index]);
                }
            }
            assert.equal(3, game.letterState.Absent.length);
            for (let char of 'ort') {
                assert.ok(game.letterState.Absent.indexOf(char) !== -1);
            }
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
        it('only updates wrong location list for as many characters are actually present in the actual word.', () => {
            let answerList = ['taboo'];
            let guessList = ['aorta', 'taboo'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            notify.internalEventListener = function (wrapper) {
                assert.fail("No notification should occur");
            };
            game = new singlegame_1.SingleGame(options, ew, notify, gamePainterMock.object, false);
            let guess = 'aorta';
            game.finalizeGuess(guess);
            assert.equal(3, game.letterState.PresentBadLocations.size);
            for (let char of game.letterState.PresentBadLocations.keys()) {
                assert.equal(1, game.letterState.PresentBadLocations.get(char).length);
                for (let index of game.letterState.PresentBadLocations.get(char)) {
                    assert.equal(char, guess[index]);
                }
            }
            assert.equal(1, game.letterState.Absent.length);
            assert.ok(game.letterState.Absent.indexOf('r') !== -1);
            gamePainterMock.verify(x => x.typeLetter(TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintBoard(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.resetBoard(), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintWords(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.paintDetails(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.never());
            gamePainterMock.verify(x => x.truncateBoard(TypeMoq.It.isAny()), TypeMoq.Times.never());
        });
    });
});
//# sourceMappingURL=SingleGameTests.js.map