import { FIVE_LETTER_ANSWERS } from '../Constants/Words/FiveLetterAnswers';
import { FIVE_LETTER_GUESSES } from '../Constants/Words/FiveLetterGuesses';
import { ElementVisibilityPainter } from '../HtmlPainters/ElementVisibilityPainter';
import { GameplayTranslator } from './GameplayTranslator';
import { ScoreHandler } from './ScoreHandler';

$(document).ready(function () {
    const scoreHandler = new ScoreHandler();
    new GameplayTranslator(FIVE_LETTER_ANSWERS, FIVE_LETTER_GUESSES, scoreHandler);
    new ElementVisibilityPainter(scoreHandler.accessPainter());
});