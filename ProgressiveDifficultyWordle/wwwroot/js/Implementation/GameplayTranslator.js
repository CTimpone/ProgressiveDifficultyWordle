"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameplayTranslator = void 0;
const typescript_cookie_1 = require("typescript-cookie");
const DOMConstants_1 = require("../Constants/DOMConstants");
const CookieConstants_1 = require("../Constants/CookieConstants");
const GameType_1 = require("../Models/GameType");
const GuessResult_1 = require("../Models/GuessResult");
const Session_1 = require("../WordleAccessLayer/Session");
const GamePainter_1 = require("../HtmlPainters/GamePainter");
const NotificationPainter_1 = require("../HtmlPainters/NotificationPainter");
const ScoreHandler_1 = require("./ScoreHandler");
class GameplayTranslator {
    constructor(validAnswers, validGuesses) {
        this.controlChord = false;
        this.altChord = false;
        this.currentWord = "";
        this.validAnswers = validAnswers;
        this.validGuesses = validGuesses;
        this.gamePainter = new GamePainter_1.GamePainter();
        this.scoreHandler = new ScoreHandler_1.ScoreHandler();
        this.notificationPainter = new NotificationPainter_1.NotificationPainter();
        this.registerPlayClickEvent();
        this.registerKeydownEvent();
        this.registerKeyupEvent();
        this.registerVirtualKeyboardEvent();
        const hardModeCookie = (0, typescript_cookie_1.getCookie)(CookieConstants_1.cookieConstants.HARD_MODE_COOKIE_NAME);
        const currentDarkMode = hardModeCookie !== undefined && hardModeCookie.toLowerCase() === "true";
        this.handleHardMode(currentDarkMode);
    }
    handleHardMode(hardMode) {
        if (hardMode) {
            $("#hardMode").prop("checked", true);
        }
        else {
            $("#hardMode").prop("checked", false);
        }
        (0, typescript_cookie_1.setCookie)(CookieConstants_1.cookieConstants.HARD_MODE_COOKIE_NAME, hardMode, { expires: 365 });
    }
    registerVirtualKeyboardEvent() {
        if (!this.virtualKeyboardRegistered) {
            this.virtualKeyboardRegistered = true;
            const scope = this;
            $(".baseKey, .bigKey").click(function (event) {
                event.preventDefault();
                if (!$("#mainGameContainer").hasClass(DOMConstants_1.domConstants.LOCKED_CLASS_NAME)) {
                    scope.inputLetter($(event.currentTarget).attr("key").toUpperCase());
                }
            });
        }
    }
    registerPlayClickEvent() {
        if (!this.playClickRegistered) {
            this.playClickRegistered = true;
            const scope = this;
            $("#playButton").click(function (event) {
                if (scope.session === undefined || !scope.session.state.active) {
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
                    (0, typescript_cookie_1.setCookie)(CookieConstants_1.cookieConstants.HARD_MODE_COOKIE_NAME, hardMode, { expires: 365 });
                    scope.startSession(gameType, hardMode, maxGuesses, timerEnabled, timerLength);
                }
            });
        }
    }
    registerKeydownEvent() {
        if (!this.keydownRegistered) {
            this.keydownRegistered = true;
            const scope = this;
            $(document).keydown(function (event) {
                const currentKey = event.key.toUpperCase();
                const gameContainerElement = $("#mainGameContainer, #rowsContainer");
                if (!gameContainerElement.hasClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME) &&
                    !gameContainerElement.hasClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME) &&
                    !gameContainerElement.hasClass(DOMConstants_1.domConstants.LOCKED_CLASS_NAME)) {
                    switch (currentKey) {
                        case "CONTROL":
                            scope.controlChord = true;
                            break;
                        case "ALT":
                            scope.altChord = true;
                            break;
                        default:
                            if (!scope.altChord && !scope.controlChord) {
                                scope.inputLetter(currentKey);
                            }
                    }
                }
            });
        }
    }
    registerKeyupEvent() {
        if (!this.keyupRegistered) {
            this.keyupRegistered = true;
            const scope = this;
            $(document).keyup(function (event) {
                const currentKey = event.key.toUpperCase();
                switch (currentKey) {
                    case "CONTROL":
                        scope.controlChord = false;
                        break;
                    case "ALT":
                        scope.altChord = false;
                        break;
                    default:
                        break;
                }
            });
            window.onfocus = function () {
                scope.controlChord = false;
                scope.altChord = false;
            };
        }
    }
    inputLetter(key) {
        if (this.session !== undefined && this.session.isCurrentGameActive()) {
            const isLetter = /^[A-Z]$/.test(key);
            const isOk = /^ENTER|ACCEPT|EXECUTE$/.test(key);
            const isDelete = /^BACKSPACE$/.test(key);
            if (this.currentWord.length < 5 && isLetter) {
                this.gamePainter.typeLetter(key, this.currentWord.length);
                this.currentWord += key;
            }
            else if (this.currentWord.length === 5 && isOk) {
                const guessResult = this.session.next(this.currentWord);
                if (!this.session.isCurrentGameActive()) {
                    $("#playButton").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                    //TO DO SHOW SCORING
                }
                else if (guessResult === GuessResult_1.GuessResult.GameComplete || guessResult === GuessResult_1.GuessResult.Progress) {
                    this.currentWord = "";
                }
            }
            else if (isDelete) {
                this.currentWord = this.currentWord.slice(0, -1);
                this.gamePainter.typeLetter("", this.currentWord.length);
            }
        }
        else if ($("#playButton").has(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME)) {
            this.currentWord = "";
            $("#playButton").removeClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
        }
    }
    startSession(type, hardMode, maxGuesses, timerEnabled, timerLength) {
        this.currentWord = "";
        this.session = new Session_1.Session(type, this.validAnswers, this.validAnswers, this.notificationPainter.notificationEventing, this.gamePainter, this.scoreHandler, hardMode, maxGuesses, timerEnabled, timerLength);
    }
}
exports.GameplayTranslator = GameplayTranslator;
//# sourceMappingURL=GameplayTranslator.js.map