"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DOMConstants_1 = require("../Constants/DOMConstants");
const FiveLetterAnswers_1 = require("../Constants/Words/FiveLetterAnswers");
const FiveLetterGuesses_1 = require("../Constants/Words/FiveLetterGuesses");
const GameType_1 = require("../Models/GameType");
const GuessResult_1 = require("../Models/GuessResult");
const LetterStatus_1 = require("../Models/LetterStatus");
const NotificationEventing_1 = require("../Models/Notification/NotificationEventing");
const NotificationType_1 = require("../Models/Notification/NotificationType");
const Session_1 = require("../Models/Session");
const GameBoardDomManipulation_1 = require("./GameBoardDomManipulation");
$(document).ready(function () {
    const notifications = new NotificationEventing_1.NotificationEventing();
    const notifyFn = (notification) => {
        $("#notificationContent").text(notification.message);
        if (notification.type === NotificationType_1.NotificationType.Info) {
            $("#notificationsContainer").addClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME)
                .removeClass(DOMConstants_1.domConstants.ERROR_CLASS_NAME)
                .removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
        }
        else {
            $("#notificationsContainer").addClass(DOMConstants_1.domConstants.ERROR_CLASS_NAME)
                .removeClass(DOMConstants_1.domConstants.EXACT_MATCH_CLASS_NAME)
                .removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
        }
        const timeout = setTimeout(function () {
            $("#notificationsContainer").addClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
        }, 8000);
        $(document).one("click", function () {
            $("#notificationsContainer").addClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            clearTimeout(timeout);
        });
    };
    notifications.registerListener(notifyFn);
    const domManipulation = new GameBoardDomManipulation_1.GameBoardDomManipulation();
    let currentWord = "";
    const activeChords = {
        "CONTROL": false,
        "ALT": false
    };
    let session = undefined;
    $("#playButton").click(function (event) {
        if (session === undefined || !session.state.active) {
            $(event.currentTarget).addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            const gameTypeElements = $("#radioContainer input");
            let gameTypeString = undefined;
            for (const element of gameTypeElements) {
                if ($(element).prop("checked") === true) {
                    gameTypeString = $(element).val();
                }
            }
            let gameType = undefined;
            let timerEnabled = false;
            let timerLength = undefined;
            let maxGuesses = 6;
            switch (gameTypeString) {
                case "endless":
                    gameType = GameType_1.GameType.Endless;
                    break;
                case "scaling":
                    gameType = GameType_1.GameType.ProgressiveDifficulty;
                    break;
                case "single":
                default:
                    gameType = GameType_1.GameType.Single;
            }
            if (gameType !== GameType_1.GameType.ProgressiveDifficulty) {
                const timerToggle = $("#timerEnable");
                timerEnabled = timerToggle.prop("checked");
                if (timerEnabled) {
                    timerLength = Number($("#timerLengthInput").val());
                }
                maxGuesses = Number($("#maxGuessesSelect option:selected").val());
            }
            const hardMode = $("#hardMode").prop("checked");
            session = new Session_1.Session(gameType, FiveLetterAnswers_1.FIVE_LETTER_ANSWERS, FiveLetterGuesses_1.FIVE_LETTER_GUESSES, notifications, domManipulation, hardMode, maxGuesses, timerEnabled, timerLength);
        }
    });
    const letterFunction = function (key) {
        if (session !== undefined && session.isCurrentGameActive()) {
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
                else if (guessResult === GuessResult_1.GuessResult.GameComplete) {
                    currentWord = "";
                    $("#playButton").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                    //TO DO SHOW SCORING
                }
            }
            else if (isDelete) {
                currentWord = currentWord.slice(0, -1);
                domManipulation.typeLetter("", currentWord.length);
            }
        }
        else if ($("#playButton").has(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME)) {
            currentWord = "";
            $("#playButton").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
    };
    $(document).keydown(function (event) {
        const currentKey = event.key.toUpperCase();
        const gameContainerElement = $("#mainGameContainer, #rowsContainer");
        if (!gameContainerElement.hasClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME) &&
            !gameContainerElement.hasClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME) &&
            !gameContainerElement.hasClass(DOMConstants_1.domConstants.LOCKED_CLASS_NAME)) {
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
        if (!$("#mainGameContainer").hasClass(DOMConstants_1.domConstants.LOCKED_CLASS_NAME)) {
            letterFunction($(event.currentTarget).attr("key").toUpperCase());
        }
    });
    $("#helpSelector").click(function (event) {
        $("#settingsContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        if ($("#helpContainer").hasClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME)) {
            $("#helpContainer").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").addClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").addClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
        else {
            $("#helpContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
    });
    $("#settingsSelector").click(function (event) {
        $("#helpContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        if ($("#settingsContainer").hasClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME)) {
            $("#settingsContainer").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").addClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").addClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
        else {
            $("#settingsContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
    });
    $("#returnToBoard").click(function (event) {
        $("#settingsContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        $("#helpContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        $("#keyboard, #rowsContainer").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
        $(".detailsColumn").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
        $("#returnToBoard").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
    });
    $("#nightDisplay").click(function (event) {
        $("body").toggleClass("night");
    });
    $(".radioContainer label").click(function (event) {
        const gameType = $(`#${$(event.currentTarget).attr("for")}`).val();
        switch (gameType) {
            case "single":
                $("#singleGameDesc").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#endlessGameDesc").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#scalingGameDesc").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#advancedSettings").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                break;
            case "endless":
                $("#singleGameDesc").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#endlessGameDesc").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#scalingGameDesc").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#advancedSettings").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                break;
            case "scaling":
                $("#singleGameDesc").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#endlessGameDesc").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#scalingGameDesc").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#advancedSettings").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                break;
            default:
                break;
        }
    });
    $("#timerEnableToggle").click(function (event) {
        const checked = $(event.currentTarget).find("input").prop("checked");
        console.log(checked);
        $("#timerLengthInput").prop("disabled", !checked);
    });
    window.paintBoard = domManipulation.paintBoard;
    window.resetBoard = domManipulation.resetBoard;
    window.paintWords = domManipulation.paintWords;
    window.letterStatus = LetterStatus_1.LetterStatus;
    console.log("Not yet implemented.");
});
//# sourceMappingURL=Initializer.js.map