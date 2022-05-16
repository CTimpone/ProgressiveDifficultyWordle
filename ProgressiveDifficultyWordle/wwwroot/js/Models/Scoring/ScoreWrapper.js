"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreWrapper = void 0;
const ResultHistory_1 = require("./ResultHistory");
class ScoreWrapper {
    constructor() {
        this.endlessScores = [];
        this.scalingScores = [];
        this.singleHistory = new ResultHistory_1.ResultHistory();
    }
}
exports.ScoreWrapper = ScoreWrapper;
//# sourceMappingURL=ScoreWrapper.js.map