import { FIVE_LETTER_ANSWERS } from '../Constants/Words/FiveLetterAnswers';
import { FIVE_LETTER_GUESSES } from '../Constants/Words/FiveLetterGuesses';
import { ElementVisibilityPainter } from '../HtmlPainters/ElementVisibilityPainter';
import { GameplayTranslator } from './GameplayTranslator';

$(document).ready(function () {
    new GameplayTranslator(FIVE_LETTER_ANSWERS, FIVE_LETTER_GUESSES);
    new ElementVisibilityPainter();
});