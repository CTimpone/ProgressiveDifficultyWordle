import { ScorePainterInterface } from "../Interfaces/ScorePainterInterface";
import { GameType } from "../Models/GameType";
import { HighScore } from "../Models/Scoring/HighScore";
import { ResultHistory } from "../Models/Scoring/ResultHistory";

export class ScorePainter implements ScorePainterInterface {
    
    constructor() {
    }

    paintStats(history: ResultHistory): void {
        throw new Error("Method not implemented.");
    }
    paintHighScores(type: GameType, scores: HighScore[]): void {
        throw new Error("Method not implemented.");
    }
}