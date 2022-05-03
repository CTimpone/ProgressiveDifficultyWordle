import { domConstants } from '../Constants/DOMConstants';
import { FIVE_LETTER_ANSWERS } from '../constants/words/fiveletteranswers';
import { FIVE_LETTER_GUESSES } from '../Constants/Words/FiveLetterGuesses';
import { GameType } from '../Models/GameType';
import { GuessResult } from '../Models/GuessResult';
import { LetterStatus } from '../Models/LetterStatus';
import { NotificationEventing } from '../Models/Notification/NotificationEventing';
import { NotificationWrapper } from '../Models/Notification/NotificationWrapper';
import { Session } from '../Models/Session';
import { GameBoardDomManipulation } from './GameBoardDomManipulation';

$(document).ready(function () {
    const notifications = new NotificationEventing();
    const notifyFn = (notification: NotificationWrapper) => {
        console.log("Not yet implemented.");
    };
    notifications.registerListener(notifyFn);

    const domManipulation = new GameBoardDomManipulation();
    const session = new Session(GameType.ProgressiveDifficulty, false, ["magic"], FIVE_LETTER_GUESSES, notifications,
        domManipulation);

    let currentWord = "";
    const activeChords = {
        "CONTROL": false,
        "ALT": false
    };

    const letterFunction = function (key: string): void {
        if (!session.isCurrentGameActive()) {
            $("#mainGameContainer").addClass(domConstants.LOCKED_CLASS_NAME);
        }
        else {
            const isLetter = /^[A-Z]$/.test(key);
            const isOk = /^ENTER|ACCEPT|EXECUTE$/.test(key);
            const isDelete = /^BACKSPACE$/.test(key);

            if (currentWord.length < 5 && isLetter) {
                domManipulation.typeLetter(key, currentWord.length);
                currentWord += key;
            }
            else if (currentWord.length === 5 && isOk) {
                const guessResult = session.next(currentWord);
                if (guessResult !== GuessResult.Invalid) {
                    currentWord = "";
                }
            }
            else if (isDelete) {
                currentWord = currentWord.slice(0, -1);
                domManipulation.typeLetter("", currentWord.length);
            }
        }
    };

    $(document).keydown(function (event) {
        const currentKey = event.key.toUpperCase();
        const gameContainerElement = $("#mainGameContainer");
        if (!gameContainerElement.hasClass(domConstants.HIDDEN_CLASS_NAME) &&
            !gameContainerElement.hasClass(domConstants.LOCKED_CLASS_NAME)) {
            switch (currentKey) {
                case "CONTROL":
                case "ALT":
                    activeChords[currentKey] = true;
                    break;
                default:
                    if (!activeChords.ALT && !activeChords.CONTROL) {
                        letterFunction(currentKey);
                    }
            }
        }
    });

    $(document).keyup(function (event) {
        const currentKey = event.key.toUpperCase();
        switch (currentKey) {
            case "CONTROL":
            case "ALT":
                activeChords[currentKey] = false;
                break;
            default:
                break;
        }
    });

    $(".baseKey, .bigKey").click(function (event) {
        event.preventDefault();
        if (!$("#mainGameContainer").hasClass(domConstants.LOCKED_CLASS_NAME)) {
            letterFunction($(event.currentTarget).attr("key").toUpperCase());
        }
    });

    (<any>window).paintBoard = domManipulation.paintBoard;
    (<any>window).resetBoard = domManipulation.resetBoard;
    (<any>window).paintWords = domManipulation.paintWords;
    (<any>window).letterStatus = LetterStatus;

    console.log("Not yet implemented.");

});