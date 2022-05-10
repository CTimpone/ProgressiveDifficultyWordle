import { domConstants } from '../Constants/DOMConstants';
import { FIVE_LETTER_ANSWERS } from '../Constants/Words/FiveLetterAnswers';
import { FIVE_LETTER_GUESSES } from '../Constants/Words/FiveLetterGuesses';
import { GameType } from '../Models/GameType';
import { GuessResult } from '../Models/GuessResult';
import { LetterStatus } from '../Models/LetterStatus';
import { NotificationEventing } from '../Models/Notification/NotificationEventing';
import { NotificationType } from '../Models/Notification/NotificationType';
import { NotificationWrapper } from '../Models/Notification/NotificationWrapper';
import { Session } from '../Models/Session';
import { GameBoardDomManipulation } from './GameBoardDomManipulation';

$(document).ready(function () {
    const notifications = new NotificationEventing();
    const notifyFn = (notification: NotificationWrapper) => {
        $("#notificationContent").text(notification.message);

        if (notification.type === NotificationType.Info) {
        $("#notificationsContainer").addClass(domConstants.EXACT_MATCH_CLASS_NAME)
                .removeClass(domConstants.ERROR_CLASS_NAME)
                .removeClass(domConstants.INVISIBLE_CLASS_NAME);
        } else {
            $("#notificationsContainer").addClass(domConstants.ERROR_CLASS_NAME)
                .removeClass(domConstants.EXACT_MATCH_CLASS_NAME)
                .removeClass(domConstants.INVISIBLE_CLASS_NAME);
        }

        const timeout = setTimeout(function () {
            $("#notificationsContainer").addClass(domConstants.INVISIBLE_CLASS_NAME);
        }, 8000);

        $(document).one("click", function () {
            $("#notificationsContainer").addClass(domConstants.INVISIBLE_CLASS_NAME);
            clearTimeout(timeout);
        });
    };

    notifications.registerListener(notifyFn);

    const domManipulation = new GameBoardDomManipulation();

    let currentWord = "";
    const activeChords = {
        "CONTROL": false,
        "ALT": false
    };

    let session = undefined;

    $("#playButton").click(function (event) {
        if (session === undefined || !session.state.active) {
            $(event.currentTarget).addClass(domConstants.HIDDEN_CLASS_NAME);

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
                    gameType = GameType.Endless;
                    break;
                case "scaling":
                    gameType = GameType.ProgressiveDifficulty;
                    break;
                case "single":
                default:
                    gameType = GameType.Single;
            }

            if (gameType !== GameType.ProgressiveDifficulty) {
                const timerToggle = $("#timerEnable");
                timerEnabled = timerToggle.prop("checked");
                if (timerEnabled) {
                    timerLength = Number($("#timerLengthInput").val());
                }

                maxGuesses = Number($("#maxGuessesSelect option:selected").val());
            }
            const hardMode = $("#hardMode").prop("checked");
            session = new Session(gameType, FIVE_LETTER_ANSWERS, FIVE_LETTER_GUESSES,
                notifications, domManipulation, hardMode, maxGuesses, timerEnabled, timerLength);
        }
    });

    const letterFunction = function (key: string): void {
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
                if (guessResult === GuessResult.Progress) {
                    currentWord = "";
                } else if (guessResult === GuessResult.GameComplete) {
                    currentWord = "";
                    $("#playButton").removeClass(domConstants.HIDDEN_CLASS_NAME);
                    //TO DO SHOW SCORING
                }
            }
            else if (isDelete) {
                currentWord = currentWord.slice(0, -1);
                domManipulation.typeLetter("", currentWord.length);
            }
        } else if ($("#playButton").has(domConstants.HIDDEN_CLASS_NAME)) {
            currentWord = "";
            $("#playButton").removeClass(domConstants.HIDDEN_CLASS_NAME);
        }
    };

    $(document).keydown(function (event) {
        const currentKey = event.key.toUpperCase();
        const gameContainerElement = $("#mainGameContainer, #rowsContainer");
        if (!gameContainerElement.hasClass(domConstants.HIDDEN_CLASS_NAME) &&
            !gameContainerElement.hasClass(domConstants.INVISIBLE_CLASS_NAME) &&
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

    $("#helpSelector").click(function (event) {
        $("#settingsContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
        if ($("#helpContainer").hasClass(domConstants.HIDDEN_CLASS_NAME)) {
            $("#helpContainer").removeClass(domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").addClass(domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").addClass(domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").removeClass(domConstants.HIDDEN_CLASS_NAME);
        } else {
            $("#helpContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").removeClass(domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").removeClass(domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").addClass(domConstants.HIDDEN_CLASS_NAME);
        }
    });

    $("#settingsSelector").click(function (event) {
        $("#helpContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
        if ($("#settingsContainer").hasClass(domConstants.HIDDEN_CLASS_NAME)) {
            $("#settingsContainer").removeClass(domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").addClass(domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").addClass(domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").removeClass(domConstants.HIDDEN_CLASS_NAME);
        } else {
            $("#settingsContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
            $("#keyboard, #rowsContainer").removeClass(domConstants.INVISIBLE_CLASS_NAME);
            $(".detailsColumn").removeClass(domConstants.INVISIBLE_CLASS_NAME);
            $("#returnToBoard").addClass(domConstants.HIDDEN_CLASS_NAME);
        }
    });

    $("#returnToBoard").click(function (event) {
        $("#settingsContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
        $("#helpContainer").addClass(domConstants.HIDDEN_CLASS_NAME);

        $("#keyboard, #rowsContainer").removeClass(domConstants.INVISIBLE_CLASS_NAME);
        $(".detailsColumn").removeClass(domConstants.INVISIBLE_CLASS_NAME);
        $("#returnToBoard").addClass(domConstants.HIDDEN_CLASS_NAME);

    });

    $("#nightDisplay").click(function (event) {
        $("body").toggleClass("night");
    });

    $(".radioContainer label").click(function (event) {
        const gameType = $(`#${$(event.currentTarget).attr("for")}`).val();
        switch (gameType) {
            case "single":
                $("#singleGameDesc").removeClass(domConstants.HIDDEN_CLASS_NAME);
                $("#endlessGameDesc").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scalingGameDesc").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#advancedSettings").removeClass(domConstants.HIDDEN_CLASS_NAME);
                break;
            case "endless":
                $("#singleGameDesc").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#endlessGameDesc").removeClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scalingGameDesc").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#advancedSettings").removeClass(domConstants.HIDDEN_CLASS_NAME);
                break;
            case "scaling":
                $("#singleGameDesc").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#endlessGameDesc").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scalingGameDesc").removeClass(domConstants.HIDDEN_CLASS_NAME);
                $("#advancedSettings").addClass(domConstants.HIDDEN_CLASS_NAME);
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


    (<any>window).paintBoard = domManipulation.paintBoard;
    (<any>window).resetBoard = domManipulation.resetBoard;
    (<any>window).paintWords = domManipulation.paintWords;
    (<any>window).letterStatus = LetterStatus;

    console.log("Not yet implemented.");

});