import { ScorePainterInterface } from "./ScorePainterInterface";

import { GameType } from "../Models/GameType";
import { ScoreDetails } from "../WordleAccessLayer/ScoreDetails";

export interface ScoreHandlingInterface {
    updateHighScores(type: GameType, details: ScoreDetails, success?: boolean, guessCount?: number): void;
    displayScores(type: GameType): void;
    accessPainter(): ScorePainterInterface; 
}