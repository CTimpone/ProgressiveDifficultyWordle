"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const GuessDetails_1 = require("../../ProgressiveDifficultyWordle/TypeScript/WordleAccessLayer/GuessDetails");
const LetterStatus_1 = require("../../ProgressiveDifficultyWordle/TypeScript/Models/LetterStatus");
describe("GuessDetails", () => {
    var consoleSpy;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('sets fullMatch to true if the input and the answer are equal.', () => {
            let gd = new GuessDetails_1.GuessDetails('alert', 'alert');
            assert.equal(true, gd.fullMatch);
        });
        it('sets fullMatch to false if the input and the answer are not equal.', () => {
            let gd = new GuessDetails_1.GuessDetails('wrong', 'alert');
            assert.equal(false, gd.fullMatch);
        });
    });
    describe("#buildCharacterMap", () => {
        it('adds a new key for a charcter not present in the map when the map is empty.', () => {
            let gd = new GuessDetails_1.GuessDetails('alert', 'value');
            let map = new Map();
            gd.buildCharacterMap(map, 'alert', 0);
            assert.equal(1, map.size);
            assert.equal(1, map.get('a').length);
            assert.equal(0, map.get('a')[0]);
        });
        it('adds a new key for a charcter not present in the map when another key exists on the map.', () => {
            let gd = new GuessDetails_1.GuessDetails('basic', 'value');
            let map = new Map();
            map.set('b', [0]);
            gd.buildCharacterMap(map, 'basic', 1);
            assert.equal(2, map.size);
            assert.equal(1, map.get('a').length);
            assert.equal(1, map.get('a')[0]);
        });
        it('updates an existing key for a charcter already present in the map with the new index.', () => {
            let gd = new GuessDetails_1.GuessDetails('aback', 'value');
            let map = new Map();
            map.set('a', [0]);
            map.set('b', [1]);
            gd.buildCharacterMap(map, 'aback', 2);
            assert.equal(2, map.size);
            assert.equal(2, map.get('a').length);
            assert.equal(0, map.get('a')[0]);
            assert.equal(2, map.get('a')[1]);
        });
    });
    describe("#populateCharacterStates", () => {
        it('fills character states array entirely with ExactMatch status when input maps are identical.', () => {
            let gd = new GuessDetails_1.GuessDetails('alert', 'alert');
            gd.characterStates = new Array(5);
            let guessMap = new Map();
            let answerMap = new Map();
            guessMap.set('a', [0]);
            answerMap.set('a', [0]);
            guessMap.set('l', [1]);
            answerMap.set('l', [1]);
            guessMap.set('e', [2]);
            answerMap.set('e', [2]);
            guessMap.set('r', [3]);
            answerMap.set('r', [3]);
            guessMap.set('t', [4]);
            answerMap.set('t', [4]);
            gd.populateCharacterStates(guessMap, answerMap);
            for (let i = 0; i < 5; i++) {
                assert.equal(LetterStatus_1.LetterStatus.ExactMatch, gd.characterStates[i]);
            }
        });
        it('fills character states array entirely with Absent status when input maps have no intersection.', () => {
            let gd = new GuessDetails_1.GuessDetails('wrong', 'table');
            gd.characterStates = new Array(5);
            let guessMap = new Map();
            let answerMap = new Map();
            guessMap.set('w', [0]);
            answerMap.set('t', [0]);
            guessMap.set('r', [1]);
            answerMap.set('a', [1]);
            guessMap.set('o', [2]);
            answerMap.set('b', [2]);
            guessMap.set('n', [3]);
            answerMap.set('l', [3]);
            guessMap.set('g', [4]);
            answerMap.set('e', [4]);
            gd.populateCharacterStates(guessMap, answerMap);
            for (let i = 0; i < 5; i++) {
                assert.equal(LetterStatus_1.LetterStatus.Absent, gd.characterStates[i]);
            }
        });
        it('fills character states array entirely with WrongLocation status when input maps have no intersection.', () => {
            let gd = new GuessDetails_1.GuessDetails('later', 'alert');
            gd.characterStates = new Array(5);
            let guessMap = new Map();
            let answerMap = new Map();
            guessMap.set('l', [0]);
            answerMap.set('a', [0]);
            guessMap.set('a', [1]);
            answerMap.set('l', [1]);
            guessMap.set('t', [2]);
            answerMap.set('e', [2]);
            guessMap.set('e', [3]);
            answerMap.set('r', [3]);
            guessMap.set('r', [4]);
            answerMap.set('t', [4]);
            gd.populateCharacterStates(guessMap, answerMap);
            for (let i = 0; i < 5; i++) {
                assert.equal(LetterStatus_1.LetterStatus.WrongLocation, gd.characterStates[i]);
            }
        });
        it('fills character states array entirely with all statuses to accurately represent intersection.', () => {
            let gd = new GuessDetails_1.GuessDetails('risen', 'paver');
            gd.characterStates = new Array(5);
            let guessMap = new Map();
            let answerMap = new Map();
            guessMap.set('r', [0]);
            answerMap.set('p', [0]);
            guessMap.set('i', [1]);
            answerMap.set('a', [1]);
            guessMap.set('s', [2]);
            answerMap.set('v', [2]);
            guessMap.set('e', [3]);
            answerMap.set('e', [3]);
            guessMap.set('n', [4]);
            answerMap.set('r', [4]);
            gd.populateCharacterStates(guessMap, answerMap);
            assert.equal(LetterStatus_1.LetterStatus.WrongLocation, gd.characterStates[0]);
            assert.equal(LetterStatus_1.LetterStatus.Absent, gd.characterStates[1]);
            assert.equal(LetterStatus_1.LetterStatus.Absent, gd.characterStates[2]);
            assert.equal(LetterStatus_1.LetterStatus.ExactMatch, gd.characterStates[3]);
            assert.equal(LetterStatus_1.LetterStatus.Absent, gd.characterStates[4]);
        });
    });
});
//# sourceMappingURL=GuessDetailsTests.js.map