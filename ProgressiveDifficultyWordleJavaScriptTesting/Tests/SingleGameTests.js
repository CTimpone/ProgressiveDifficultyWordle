"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const eligiblewords_1 = require("../../progressivedifficultywordle/typescript/models/eligiblewords");
const gameoptions_1 = require("../../progressivedifficultywordle/typescript/models/gameoptions");
const GuessDetails_1 = require("../../progressivedifficultywordle/typescript/models/GuessDetails");
const singlegame_1 = require("../../progressivedifficultywordle/typescript/models/singlegame");
describe("SingleGame", () => {
    var consoleSpy;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('should choose a random word as answer from the input EligibleWords.eligibleAnswers', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            let game = new singlegame_1.SingleGame(options, ew);
            assert.notEqual(undefined, game.chosenWord);
            assert.equal(true, ew.eligibleAnswers.indexOf(game.chosenWord) !== -1);
        });
    });
    describe("#validateGuess", () => {
        it('should return true if the game is active, not configured for hard-mode, and is in the guess list.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            let game = new singlegame_1.SingleGame(options, ew);
            assert.equal(true, game.validateGuess("abbot"));
        });
        it('does not update the game\'s userGuesses list regardless of whether the guess is valid or invalid.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            let game = new singlegame_1.SingleGame(options, ew);
            assert.equal(true, game.validateGuess("abbot"));
            assert.equal(0, game.userGuesses);
            assert.equal(false, game.validateGuess("abuzz"));
            assert.equal(0, game.userGuesses);
        });
        it('should return false if the game has ended.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            let game = new singlegame_1.SingleGame(options, ew);
            game.endTime = new Date();
            assert.equal(false, game.validateGuess("wrong"));
        });
        it('should return false if the user has already submitted guesses equal to the configured max guesses.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(false, 1);
            let game = new singlegame_1.SingleGame(options, ew);
            game.userGuesses.push(new GuessDetails_1.GuessDetails("other", game.chosenWord));
            assert.equal(game.options.maxGuesses, game.userGuesses.length);
            assert.equal(false, game.validateGuess("wrong"));
        });
        it('should return false if the user has already submitted guesses greater than the configured max guesses.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(false, 1);
            let game = new singlegame_1.SingleGame(options, ew);
            game.userGuesses.push(new GuessDetails_1.GuessDetails("other", game.chosenWord));
            game.userGuesses.push(new GuessDetails_1.GuessDetails("again", game.chosenWord));
            assert.ok(game.options.maxGuesses < game.userGuesses.length);
            assert.equal(false, game.validateGuess("wrong"));
        });
        it('should return false if the input is not all lower-case letters.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            let game = new singlegame_1.SingleGame(options, ew);
            assert.equal(false, game.validateGuess("WRONG"));
            assert.equal(false, game.validateGuess("WRoNG"));
            assert.equal(false, game.validateGuess("wrOng"));
            assert.equal(false, game.validateGuess("!rong"));
            assert.equal(false, game.validateGuess("wr0ng"));
        });
        it('should return false if the input does not match the length of the answer.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions();
            let game = new singlegame_1.SingleGame(options, ew);
            assert.equal(false, game.validateGuess("abbo"));
            assert.equal(false, game.validateGuess("abho"));
            assert.equal(false, game.validateGuess("abid"));
            assert.equal(false, game.validateGuess("ab"));
            assert.equal(false, game.validateGuess("appple"));
        });
        it('should return false if the game is configured for hard-mode, and the guess does not have all completely known characters present.', () => {
            let answerList = ['abhor'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(true);
            let game = new singlegame_1.SingleGame(options, ew);
            game.letterState.ExactMatch.set(0, 'a');
            game.letterState.ExactMatch.set(1, 'b');
            assert.equal(false, game.validateGuess("apple"));
        });
        it('should return true if the game is configured for hard-mode, and the guess does have all completely known characters present, but ignores characters known to be present, but not the exact location.', () => {
            let answerList = ['abode'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'abuzz'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(true);
            let game = new singlegame_1.SingleGame(options, ew);
            game.letterState.ExactMatch.set(0, 'a');
            game.letterState.ExactMatch.set(1, 'b');
            game.letterState.PresentBadLocations.set('o', [3]);
            assert.equal(true, game.validateGuess("abuzz"));
        });
        it('should return false if the guess in not in the EligibleWords.eligibleGuesses list.', () => {
            let answerList = ['abhor'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];
            let ew = new eligiblewords_1.EligibleWords(answerList, guessList);
            let options = new gameoptions_1.GameOptions(true);
            let game = new singlegame_1.SingleGame(options, ew);
            game.letterState.ExactMatch.set(0, 'a');
            game.letterState.ExactMatch.set(1, 'b');
            assert.equal(false, game.validateGuess("abuzz"));
            assert.equal(-1, game.eligibleWords.eligibleGuesses.indexOf("abuzz"));
        });
    });
});
//# sourceMappingURL=SingleGameTests.js.map