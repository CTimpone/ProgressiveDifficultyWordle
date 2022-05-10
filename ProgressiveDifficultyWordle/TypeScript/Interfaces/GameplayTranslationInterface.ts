import { GameType } from "../Models/GameType";

export interface GameplayTranslationInterface {
    inputLetter(key: string): void;
    startSession(type: GameType, hardMode: boolean, maxGuesses: number, timerEnabled: boolean, timerLength?: number): void;
}