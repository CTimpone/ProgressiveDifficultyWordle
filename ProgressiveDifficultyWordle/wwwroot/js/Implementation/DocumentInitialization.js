"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FiveLetterAnswers_1 = require("../Constants/Words/FiveLetterAnswers");
const FiveLetterGuesses_1 = require("../Constants/Words/FiveLetterGuesses");
const ElementVisibilityPainter_1 = require("../HtmlPainters/ElementVisibilityPainter");
const GameplayTranslator_1 = require("./GameplayTranslator");
$(document).ready(function () {
    new GameplayTranslator_1.GameplayTranslator(FiveLetterAnswers_1.FIVE_LETTER_ANSWERS, FiveLetterGuesses_1.FIVE_LETTER_GUESSES);
    new ElementVisibilityPainter_1.ElementVisibilityPainter();
});
//# sourceMappingURL=DocumentInitialization.js.map