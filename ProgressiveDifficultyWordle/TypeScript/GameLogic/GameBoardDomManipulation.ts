import { domConstants } from "../Constants/DOMConstants";
import { DomManipulator } from "../Interfaces/DomManipulator";
import { GameType } from "../Models/GameType";
import { LetterStatus } from "../Models/LetterStatus";
import { ScoreDetails } from "../Models/ScoreDetails";
import { SessionState } from "../Models/SessionState";

export class GameBoardDomManipulation implements DomManipulator {
    typeLetter(key: string, currentLetterIndex: number): void {
        $(`.wordleRow[active-row=true] .tile[tile-index=${currentLetterIndex}] span`).text(key);
    }

    paintBoard(words: string[], letterStatuses: LetterStatus[][], onlyPaintLast: boolean, activeGame: boolean): void {
        const length = words.length;
        if (length > 0) {
            this.paintWords(length, words, letterStatuses, onlyPaintLast, activeGame);
        }
        else {
            this.resetBoard();
        }
    }

    truncateBoard(maxGuesses: number) {
        for (maxGuesses; maxGuesses < 6; maxGuesses++) {
            $(`.wordleRow[row-index=${maxGuesses}]`).addClass(domConstants.HIDDEN_CLASS_NAME);

        }
    }

    paintDetails(type: GameType, sessionState: SessionState, scoreDetails: ScoreDetails) {
        switch (type) {
            case GameType.Endless:
                $("#gameTypeVal").text("Endless");
                $("#currentRoundDisplay").removeClass(domConstants.HIDDEN_CLASS_NAME);
                $("#currentRoundVal").text(scoreDetails.roundsCompleted + 1);
                break;
            case GameType.ProgressiveDifficulty:
                $("#gameTypeVal").text("Scaling Endless");
                $("#currentRoundDisplay").removeClass(domConstants.HIDDEN_CLASS_NAME);
                $("#currentRoundVal").text(scoreDetails.roundsCompleted + 1);
                break;
            case GameType.Single:
                $("#gameTypeVal").text("Single Game");
                $("#currentRoundDisplay").addClass(domConstants.HIDDEN_CLASS_NAME);
                break;
            default:
                break;
        }

        $("#maxGuessesVal").text(sessionState.maxGuesses);
        $("#scoreVal").text(scoreDetails.totalScore);

        if (sessionState.hardMode === true) {
            $("#hardModeOnIcon").removeClass(domConstants.HIDDEN_CLASS_NAME);
            $("#hardModeOffIcon").addClass(domConstants.HIDDEN_CLASS_NAME);
        }
        else {
            $("#hardModeOnIcon").addClass(domConstants.HIDDEN_CLASS_NAME);
            $("#hardModeOffIcon").removeClass(domConstants.HIDDEN_CLASS_NAME);

        }
    }

    resetBoard() {
        $(".tile span").text("");
        $(".tile").removeClass(domConstants.FLIPPED_CLASS_NAME);
        $(".tileBack").removeClass(domConstants.EXACT_MATCH_CLASS_NAME)
            .removeClass(domConstants.ABSENT_LETTER_CLASS_NAME)
            .removeClass(domConstants.WRONG_LOCATION_CLASS_NAME);
        $(".wordleRow").attr("active-row", "false").removeClass(domConstants.HIDDEN_CLASS_NAME);
        $(".wordleRow[row-index=0]").attr("active-row", "true");
    }

    paintWords(length: number, words: string[], letterStatuses: LetterStatus[][], onlyPaintLast: boolean,
        activeGame: boolean): void {
        if (activeGame) {
            $(`.wordleRow[row-index=${length - 1}]`).attr("active-row", "false");
            $(`.wordleRow[row-index=${length}]`).attr("active-row", "true");
        }

        for (let i = 0; i < length; i++) {
            if (i === length - 1 || onlyPaintLast !== true) {
                const currentWord = words[i];
                const statuses = letterStatuses[i];

                const tiles = $(`.wordleRow[row-index=${i}] .tileBack`);

                for (let j = 0; j < tiles.length; j++) {
                    const tile = tiles[j];
                    const relevantKey = $(`.baseKey[key=${currentWord[j]}]`);
                    $(tile).find("span").text(currentWord[j].toUpperCase());
                    switch (statuses[j]) {
                        case LetterStatus.ExactMatch:
                            $(tile).addClass(domConstants.EXACT_MATCH_CLASS_NAME);
                            relevantKey.removeClass(domConstants.WRONG_LOCATION_CLASS_NAME);
                            relevantKey.addClass(domConstants.EXACT_MATCH_CLASS_NAME);
                            break;
                        case LetterStatus.Absent:
                            $(tile).addClass(domConstants.ABSENT_LETTER_CLASS_NAME);
                            if (!relevantKey.hasClass(domConstants.EXACT_MATCH_CLASS_NAME)
                                && !relevantKey.hasClass(domConstants.WRONG_LOCATION_CLASS_NAME)) {
                                relevantKey.addClass(domConstants.ABSENT_LETTER_CLASS_NAME);
                            }
                            break;
                        case LetterStatus.WrongLocation:
                            $(tile).addClass(domConstants.WRONG_LOCATION_CLASS_NAME);
                            if (!relevantKey.hasClass(domConstants.EXACT_MATCH_CLASS_NAME)) {
                                relevantKey.addClass(domConstants.WRONG_LOCATION_CLASS_NAME);
                            }
                            break;
                        default:
                            break;
                    }
                }

                $(`.wordleRow[row-index=${i}] .tile`).addClass("flipped");
            }
        }
    }

    paintTimer(seconds: number) {
        $("#timerVal").text(seconds.toString());
    }
}