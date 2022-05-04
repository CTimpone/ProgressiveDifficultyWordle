"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameBoardDomManipulation = void 0;
const DOMConstants_1 = require("../Constants/DOMConstants");
const GameType_1 = require("../Models/GameType");
const LetterStatus_1 = require("../Models/LetterStatus");
class GameBoardDomManipulation {
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
    truncateBoard(maxGuesses) {
        for (maxGuesses; maxGuesses < 6; maxGuesses++) {
            $(`.wordleRow[row-index=${maxGuesses}]`).addClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
        }
    }
    paintDetails(type, sessionState, scoreDetails) {
        switch (type) {
            case GameType_1.GameType.Endless:
                $("#gameTypeVal").text("Endless");
                $("#currentRoundDisplay").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#currentRoundVal").text(scoreDetails.roundsCompleted + 1);
                break;
            case GameType_1.GameType.ProgressiveDifficulty:
                $("#gameTypeVal").text("Scaling");
                $("#currentRoundDisplay").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#currentRoundVal").text(scoreDetails.roundsCompleted + 1);
                break;
            case GameType_1.GameType.Single:
                $("#gameTypeVal").text("Single");
                $("#currentRoundDisplay").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                break;
            default:
                break;
        }
        $("#maxGuessesVal").text(sessionState.maxGuesses);
        $("#scoreVal").text(scoreDetails.totalScore);
        if (sessionState.hardMode === true) {
            $("#hardModeOnIcon").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $("#hardModeOffIcon").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
        else {
            $("#hardModeOnIcon").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $("#hardModeOffIcon").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
    }
    resetBoard() {
        $(".tile span").text("");
        $(".tile").removeClass(DOMConstants_1.domConstants.FLIPPED_CLASS_NAME);
        $(".tileBack").removeClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME)
            .removeClass(DOMConstants_1.domConstants.ABSENT_LETTER_CLASS_NAME)
            .removeClass(DOMConstants_1.domConstants.WRONG_LOCATION_CLASS_NAME);
        $(".baseKey").removeClass(DOMConstants_1.domConstants.ABSENT_LETTER_CLASS_NAME)
            .removeClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME)
            .removeClass(DOMConstants_1.domConstants.WRONG_LOCATION_CLASS_NAME);
        $(".wordleRow").attr("active-row", "false").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        $(".wordleRow[row-index=0]").attr("active-row", "true");
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
    paintTimer(seconds) {
        $("#timerVal").text(seconds.toString());
    }
}
exports.GameBoardDomManipulation = GameBoardDomManipulation;
//# sourceMappingURL=GameBoardDomManipulation.js.map