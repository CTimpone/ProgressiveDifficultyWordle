"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomManipulation = void 0;
const DOMConstants_1 = require("../Constants/DOMConstants");
const LetterStatus_1 = require("../Models/LetterStatus");
class DomManipulation {
    typeLetter(key, currentLetterIndex) {
        $(`.wordleRow[active-row=true] .tile[tile-index=${currentLetterIndex}] span`).text(key);
    }
    paintBoard(words, letterStatuses, onlyPaintLast, activeGame) {
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
        $(".tile").removeClass(DOMConstants_1.domConstants.FLIPPED_CLASS_NAME);
        $(".tileBack").removeClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME)
            .removeClass(DOMConstants_1.domConstants.ABSENT_LETTER_CLASS_NAME)
            .removeClass(DOMConstants_1.domConstants.WRONG_LOCATION_CLASS_NAME);
        $(".wordleRow").prop("active-row", false);
        $(".wordleRow[row-index=0]").prop("activeRow", true);
    }
    paintWords(length, words, letterStatuses, onlyPaintLast, activeGame) {
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
                        case LetterStatus_1.LetterStatus.ExactMatch:
                            $(tile).addClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME);
                            relevantKey.removeClass(DOMConstants_1.domConstants.WRONG_LOCATION_CLASS_NAME);
                            relevantKey.addClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME);
                            break;
                        case LetterStatus_1.LetterStatus.Absent:
                            $(tile).addClass(DOMConstants_1.domConstants.ABSENT_LETTER_CLASS_NAME);
                            if (!relevantKey.hasClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME)
                                && !relevantKey.hasClass(DOMConstants_1.domConstants.WRONG_LOCATION_CLASS_NAME)) {
                                relevantKey.addClass(DOMConstants_1.domConstants.ABSENT_LETTER_CLASS_NAME);
                            }
                            break;
                        case LetterStatus_1.LetterStatus.WrongLocation:
                            $(tile).addClass(DOMConstants_1.domConstants.WRONG_LOCATION_CLASS_NAME);
                            if (!relevantKey.hasClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME)) {
                                relevantKey.addClass(DOMConstants_1.domConstants.WRONG_LOCATION_CLASS_NAME);
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
exports.DomManipulation = DomManipulation;
//# sourceMappingURL=DomManipulation.js.map