import { LetterStatus } from "../Models/LetterStatus";

export interface DomManipulator {
    typeLetter(key: string, currentLetterIndex: number): void;
    paintBoard(words: string[], letterStatuses: LetterStatus[][], onlyPaintLast: boolean, activeGame: boolean): void;
    resetBoard(): void;
    paintWords(length: number, words: string[], letterStatuses: LetterStatus[][], onlyPaintLast: boolean,
        activeGame: boolean): void;

}