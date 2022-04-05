"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const GuessDetails_1 = require("../../progressivedifficultywordle/typescript/models/GuessDetails");
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
});
//# sourceMappingURL=GuessDetailsTests.js.map