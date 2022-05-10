import { GameType } from "../Models/GameType";
import { LetterStatus } from "../Models/LetterStatus";
import { ScoreDetails } from "../WordleAccessLayer/ScoreDetails";
import { SessionState } from "../Models/SessionState";

export interface GamePainterInterface {
    typeLetter(key: string, currentLetterIndex: number): void;
    paintBoard(words: string[], letterStatuses: LetterStatus[][], onlyPaintLast: boolean, activeGame: boolean): void;
    resetBoard(): void;
    paintWords(length: number, words: string[], letterStatuses: LetterStatus[][], onlyPaintLast: boolean,
        activeGame: boolean): void;
    paintDetails(type: GameType, sessionState: SessionState, scoreDetails: ScoreDetails);
    truncateBoard(maxGuesses: number);
    paintTimer(seconds: number): void;
}