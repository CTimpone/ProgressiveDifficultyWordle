"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fiveletteranswers_1 = require("../constants/words/fiveletteranswers");
const FiveLetterGuesses_1 = require("../Constants/Words/FiveLetterGuesses");
const GameType_1 = require("../Models/GameType");
const GuessResult_1 = require("../Models/GuessResult");
const LetterStatus_1 = require("../Models/LetterStatus");
const NotificationEventing_1 = require("../Models/Notification/NotificationEventing");
const Session_1 = require("../Models/Session");
const DomManipulation_1 = require("./DomManipulation");
$(document).ready(function () {
    const notifications = new NotificationEventing_1.NotificationEventing();
    const notifyFn = (notification) => {
        console.log("Not yet implemented.");
    };
    notifications.registerListener(notifyFn);
    const domManipulation = new DomManipulation_1.DomManipulation();
    const session = new Session_1.Session(GameType_1.GameType.Single, false, fiveletteranswers_1.FIVE_LETTER_ANSWERS, FiveLetterGuesses_1.FIVE_LETTER_GUESSES, notifications, domManipulation);
    let currentWord = "";
    const activeChords = {
        "CONTROL": false,
        "ALT": false
    };
    const letterFunction = function (key) {
        const isLetter = /^[A-Z]$/.test(key);
        const isOk = /^ENTER|ACCEPT|EXECUTE$/.test(key);
        const isDelete = /^BACKSPACE$/.test(key);
        if (currentWord.length < 5 && isLetter) {
            domManipulation.typeLetter(key, currentWord.length);
            currentWord += key;
        }
        else if (currentWord.length === 5 && isOk) {
            const guessResult = session.next(currentWord);
            if (guessResult === GuessResult_1.GuessResult.Progress) {
                currentWord = "";
            }
        }
        else if (isDelete) {
            currentWord = currentWord.slice(0, -1);
            domManipulation.typeLetter("", currentWord.length);
        }
    };
    $("html").keydown(function (event) {
        const currentKey = event.key.toUpperCase();
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
    });
    $("html").keyup(function (event) {
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
        letterFunction($(event.currentTarget).attr("key").toUpperCase());
    });
    window.paintBoard = domManipulation.paintBoard;
    window.resetBoard = domManipulation.resetBoard;
    window.paintWords = domManipulation.paintWords;
    window.letterStatus = LetterStatus_1.LetterStatus;
    console.log("Not yet implemented.");
});
//# sourceMappingURL=Initializer.js.map