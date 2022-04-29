﻿import { domConstants } from "../Constants/DOMConstants";
import { DomManipulator } from "../Interfaces/DomManipulator";
import { LetterStatus } from "../Models/LetterStatus";

export class DomManipulation implements DomManipulator {
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
    resetBoard() {
        $(".tile span").text("");
        $(".tile").removeClass(domConstants.FLIPPED_CLASS_NAME);
        $(".tileBack").removeClass(domConstants.EXACT_MATCH_CLASS_NAME)
            .removeClass(domConstants.ABSENT_LETTER_CLASS_NAME)
            .removeClass(domConstants.WRONG_LOCATION_CLASS_NAME);
        $(".wordleRow").prop("active-row", false);
        $(".wordleRow[row-index=0]").prop("activeRow", true);
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

}