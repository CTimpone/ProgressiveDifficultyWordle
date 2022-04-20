"use strict";
/// <reference path="../PDWIndex.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const sinon = require("sinon");
const SessionState_1 = require("../../ProgressiveDifficultyWordle/TypeScript/Models/SessionState");
describe("SessionState", () => {
    var consoleSpy;
    beforeEach(() => {
        consoleSpy = sinon.spy(console, 'log');
    });
    afterEach(() => {
        consoleSpy.restore();
    });
    describe("#constructor", () => {
        it('initializes parameters to allow for recording state when hardMode is submitted as true.', () => {
            let hardBool = true;
            let state = new SessionState_1.SessionState(hardBool);
            assert.equal(hardBool, state.hardMode);
            assert.equal(true, state.active);
            assert.equal(undefined, state.gameTimerLength);
            assert.equal(0, state.gameHistory.length);
            assert.equal(6, state.maxGuesses);
            assert.equal(false, state.gameTimerLimitExists);
        });
        it('initializes parameters to allow for recording state when hardMode is submitted as false.', () => {
            let hardBool = false;
            let state = new SessionState_1.SessionState(hardBool);
            assert.equal(hardBool, state.hardMode);
            assert.equal(true, state.active);
            assert.equal(undefined, state.gameTimerLength);
            assert.equal(0, state.gameHistory.length);
            assert.equal(6, state.maxGuesses);
            assert.equal(false, state.gameTimerLimitExists);
        });
    });
    describe("#getHarder", () => {
        it('initializes the timer with an input of 3.', () => {
            let state = new SessionState_1.SessionState(true);
            assert.equal(undefined, state.gameTimerLength);
            assert.equal(false, state.gameTimerLimitExists);
            state.getHarder(3);
            assert.equal(600, state.gameTimerLength);
            assert.equal(true, state.gameTimerLimitExists);
        });
        it('decreases the timer length by a minute for certain values.', () => {
            let state = new SessionState_1.SessionState(true);
            state.getHarder(3);
            for (const roundsComp of [5, 7, 11, 13, 17]) {
                const initialLength = state.gameTimerLength;
                state.getHarder(roundsComp);
                assert.equal(initialLength - 60, state.gameTimerLength);
            }
        });
        it('decreases the timer length by half a minute for certain values.', () => {
            let state = new SessionState_1.SessionState(true);
            state.getHarder(3);
            for (const roundsComp of [19, 21, 23, 25, 27, 29]) {
                const initialLength = state.gameTimerLength;
                state.getHarder(roundsComp);
                assert.equal(initialLength - 30, state.gameTimerLength);
            }
        });
        it('decreases the max guesses value by 1 for certain values.', () => {
            let state = new SessionState_1.SessionState(true);
            state.getHarder(3);
            for (const roundsComp of [9, 15, 30]) {
                const maxGuesses = state.maxGuesses;
                state.getHarder(roundsComp);
                assert.equal(maxGuesses - 1, state.maxGuesses);
            }
        });
        it('does nothing but log for other arbitrary values.', () => {
            let state = new SessionState_1.SessionState(true);
            state.getHarder(3);
            assert.equal(true, state.hardMode);
            assert.equal(true, state.active);
            assert.equal(600, state.gameTimerLength);
            assert.equal(0, state.gameHistory.length);
            assert.equal(6, state.maxGuesses);
            assert.equal(true, state.gameTimerLimitExists);
            let logCallCount = 1;
            for (const roundsComp of [1, 12, 31, 10000]) {
                state.getHarder(roundsComp);
                assert.equal(true, state.hardMode);
                assert.equal(true, state.active);
                assert.equal(600, state.gameTimerLength);
                assert.equal(0, state.gameHistory.length);
                assert.equal(6, state.maxGuesses);
                assert.equal(true, state.gameTimerLimitExists);
                assert.equal(logCallCount, consoleSpy.callCount);
                logCallCount++;
            }
        });
    });
});
//# sourceMappingURL=SessionStateTests.js.map