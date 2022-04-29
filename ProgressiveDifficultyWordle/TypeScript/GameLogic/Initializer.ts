import { FIVE_LETTER_ANSWERS } from '../constants/words/fiveletteranswers';
import { FIVE_LETTER_GUESSES } from '../Constants/Words/FiveLetterGuesses';
import { GameType } from '../Models/GameType';
import { GuessResult } from '../Models/GuessResult';
import { LetterStatus } from '../Models/LetterStatus';
import { NotificationEventing } from '../Models/Notification/NotificationEventing';
import { NotificationWrapper } from '../Models/Notification/NotificationWrapper';
import { Session } from '../Models/Session';
import { DomManipulation } from './DomManipulation';

$(document).ready(function () {
    const notifications = new NotificationEventing();
    const notifyFn = (notification: NotificationWrapper) => {
        console.log("Not yet implemented.");
    };
    notifications.registerListener(notifyFn);

    const domManipulation = new DomManipulation();
    const session = new Session(GameType.Single, false, FIVE_LETTER_ANSWERS, FIVE_LETTER_GUESSES, notifications,
        domManipulation);

    let currentWord = "";

    const letterFunction = function (key: string): void {
        const isLetter = /^[A-Z]$/.test(key);
        const isOk = /^ENTER|ACCEPT|EXECUTE$/.test(key);
        const isDelete = /^BACKSPACE$/.test(key);

        if (currentWord.length < 5 && isLetter) {
            domManipulation.typeLetter(key, currentWord.length);
            currentWord += key;
        }
        else if (currentWord.length === 5 && isOk) {
            const guessResult = session.next(currentWord);
            if (guessResult === GuessResult.Progress) {
                currentWord = "";
            }
        }
        else if (isDelete) {
            currentWord = currentWord.slice(0, -1);
            domManipulation.typeLetter("", currentWord.length);
        }

    }
    $("html").keydown(function (event) {
        event.preventDefault();
        letterFunction(event.key.toUpperCase());
    });

    $(".baseKey, .bigKey").click(function (event) {
        event.preventDefault();
        letterFunction($(event.currentTarget).attr("key").toUpperCase());
    });

    (<any>window).paintBoard = domManipulation.paintBoard;
    (<any>window).resetBoard = domManipulation.resetBoard;
    (<any>window).paintWords = domManipulation.paintWords;
    (<any>window).letterStatus = LetterStatus;

    console.log("Not yet implemented.");

});