/// <reference path="../PDWIndex.ts" />

import assert = require('assert');
import sinon = require('sinon');
import { FIVE_LETTER_ANSWERS } from '../../progressivedifficultywordle/typescript/Constants/Words/FiveLetterAnswers';
import { FIVE_LETTER_GUESSES } from '../../progressivedifficultywordle/typescript/Constants/Words/FiveLetterGuesses';
import { EligibleWords } from '../../progressivedifficultywordle/typescript/models/eligiblewords';

describe("EligibleWords", () => {
    var consoleSpy;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
    });

    afterEach(() => {
        consoleSpy.restore();
    });

    describe("#constructor", () => {
        it('should use the submitted parameters to populate lists when both are present.', () => {
            let answerList = ['first'];
            let guessList = ['first', 'again'];

            let ew = new EligibleWords(answerList, guessList);
            assert.equal(answerList.length, ew.eligibleAnswers.length);
            assert.equal(answerList[0], ew.eligibleAnswers[0]);

            assert.equal(guessList.length, ew.eligibleGuesses.length);
            assert.equal(guessList[0], ew.eligibleGuesses[0]);
            assert.equal(guessList[1], ew.eligibleGuesses[1]);

            assert.notEqual(undefined, ew.guessSearchHelper);

            assert(consoleSpy.neverCalledWith('Both eligibleAnswers and eligibleGuesses must be supplied to not rely on constants.'));

        });
    });

    describe("#buildGuessSearchHelper", () => {
        it('should build a character-based bsearch-localizing map.', () => {
            let ew = new EligibleWords(FIVE_LETTER_ANSWERS, FIVE_LETTER_GUESSES);
            assert.equal(FIVE_LETTER_ANSWERS.length, ew.eligibleAnswers.length);
            assert.equal(FIVE_LETTER_GUESSES.length, ew.eligibleGuesses.length);

            //Resetting the guessSearchHelper to allow for direct testing of the function, rather than relying on call initiated in constuctor
            ew.guessSearchHelper = new Map<string, [number, number]>();

            ew.buildGuessSearchHelper();
            assert.equal(26, ew.guessSearchHelper.size);
            let startIndex = -1;
            let endIndex = startIndex + 1;

            for (let key of ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']) {
                assert.equal(true, ew.guessSearchHelper.has(key));
                let [currentStart, currentEnd] = ew.guessSearchHelper.get(key);

                assert.ok(startIndex < currentStart, "Current startIndex in helper is greater than previous key's start index");
                assert.ok(endIndex < currentEnd, "Current endIndex in helper is greater than previous key's end index");
                assert.ok(currentStart <= currentEnd, "Current startIndex is less than (or equal to) the current endInex");

                assert.equal(key, ew.eligibleGuesses[currentStart][0]);
                assert.equal(key, ew.eligibleGuesses[currentEnd][0]);

                if (currentStart > 0) {
                    assert.notEqual(key, ew.eligibleGuesses[currentStart - 1][0]);
                }

                if (currentEnd < ew.eligibleGuesses.length - 1) {
                    assert.notEqual(key, ew.eligibleGuesses[currentEnd + 1][0]);
                }

                startIndex = currentEnd;
                endIndex = startIndex + 1;
            }
        });

        it('should build a character-based bsearch-localizing map when there is only a single eligibleGuess.', () => {
            let answerList = ['apple'];
            let guessList = ['apple'];

            let ew = new EligibleWords(answerList, guessList);
            assert.equal(1, ew.eligibleAnswers.length);
            assert.equal(1, ew.eligibleGuesses.length);

            //Resetting the guessSearchHelper to allow for direct testing of the function, rather than relying on call initiated in constuctor
            ew.guessSearchHelper = new Map<string, [number, number]>();

            ew.buildGuessSearchHelper();
            assert.equal(1, ew.guessSearchHelper.size);

            assert.ok(ew.guessSearchHelper.has('a'));
            let [startIndex, endIndex] = ew.guessSearchHelper.get('a');
            assert.equal(0, startIndex);
            assert.equal(0, endIndex);
        });


        it('should build a character-based bsearch-localizing map when all items in eligibleGuesses start with the same character.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];

            let ew = new EligibleWords(answerList, guessList);
            assert.equal(1, ew.eligibleAnswers.length);
            assert.equal(5, ew.eligibleGuesses.length);

            //Resetting the guessSearchHelper to allow for direct testing of the function, rather than relying on call initiated in constuctor
            ew.guessSearchHelper = new Map<string, [number, number]>();

            ew.buildGuessSearchHelper();
            assert.equal(1, ew.guessSearchHelper.size);

            assert.ok(ew.guessSearchHelper.has('a'));
            let [startIndex, endIndex] = ew.guessSearchHelper.get('a');
            assert.equal(0, startIndex);
            assert.equal(4, endIndex);          
        });

        it('does not care about any intersection of the contents of eligibleAnswers and eligibleGuesses when building the search map.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode'];

            let ew = new EligibleWords(answerList, guessList);
            assert.equal(1, ew.eligibleAnswers.length);
            assert.equal(4, ew.eligibleGuesses.length);

            //Resetting the guessSearchHelper to allow for direct testing of the function, rather than relying on call initiated in constuctor
            ew.guessSearchHelper = new Map<string, [number, number]>();

            ew.buildGuessSearchHelper();
            assert.equal(1, ew.guessSearchHelper.size);

            assert.ok(ew.guessSearchHelper.has('a'));
            let [startIndex, endIndex] = ew.guessSearchHelper.get('a');
            assert.equal(0, startIndex);
            assert.equal(3, endIndex);
        });

        it('performs no length checks against items in eligibleGuesses when building the map.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abhorrent', 'abide', 'abode', 'apple', 'applied'];

            let ew = new EligibleWords(answerList, guessList);
            assert.equal(1, ew.eligibleAnswers.length);
            assert.equal(7, ew.eligibleGuesses.length);

            //Resetting the guessSearchHelper to allow for direct testing of the function, rather than relying on call initiated in constuctor
            ew.guessSearchHelper = new Map<string, [number, number]>();

            ew.buildGuessSearchHelper();
            assert.equal(1, ew.guessSearchHelper.size);

            assert.ok(ew.guessSearchHelper.has('a'));
            let [startIndex, endIndex] = ew.guessSearchHelper.get('a');
            assert.equal(0, startIndex);
            assert.equal(6, endIndex);
        });

    });

    describe("#guessInWordList", () => {
        it('should locate any word in the eligibleGuesses list, returning true.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];

            let ew = new EligibleWords(answerList, guessList);

            for (let guess of guessList) {
                assert.equal(true, ew.guessInWordList(guess));
            }
        });

        it('should locate fail to find a word not in the eligibleGuesses list, returning false.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple'];

            let ew = new EligibleWords(answerList, guessList);

            assert.equal(false, ew.guessInWordList('again'));
        });

        it('relies on the contents of the guessSearchHelper to return accurate returns, resulting in improper setup not finding values that are present in eligibleGuesses.', () => {
            let answerList = ['apple'];
            let guessList = ['abbot', 'abhor', 'abide', 'abode', 'apple', 'birch'];

            let ew = new EligibleWords(answerList, guessList);
            ew.guessSearchHelper = new Map<string, [number, number]>();
            ew.guessSearchHelper.set('a', [0, 4]);

            assert.equal(false, ew.guessInWordList('birch'));
        });

    });

});