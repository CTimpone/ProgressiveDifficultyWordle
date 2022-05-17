import { GameType } from "../Models/GameType";
import { ScoreWrapper } from "../Models/Scoring/ScoreWrapper";

export interface ScorePainterInterface {
    swapToScoreSection(type?: GameType): void;
    paintScores(type: GameType): void;
    storeScoreData(data: ScoreWrapper): void;
}