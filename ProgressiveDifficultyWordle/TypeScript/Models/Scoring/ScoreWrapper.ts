import { HighScore } from "./HighScore";
import { ResultHistory } from "./ResultHistory";

export class ScoreWrapper {
    endlessScores: HighScore[];
    scalingScores: HighScore[];
    singleHistory: ResultHistory;

    constructor() {
        this.endlessScores = [];
        this.scalingScores = [];
        this.singleHistory = new ResultHistory();
    }
}