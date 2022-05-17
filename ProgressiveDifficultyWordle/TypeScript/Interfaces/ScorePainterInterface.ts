import { GameType } from "../Models/GameType";
import { HighScore } from "../Models/Scoring/HighScore";
import { ResultHistory } from "../Models/Scoring/ResultHistory";

export interface ScorePainterInterface {
    paintStats(history: ResultHistory): void;
    paintHighScores(type: GameType, scores: HighScore[]): void;
}