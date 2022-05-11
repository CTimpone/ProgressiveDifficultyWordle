import { domConstants } from "../Constants/DOMConstants";
import { GamePainterInterface } from "../Interfaces/GamePainterInterface";
import { GameType } from "../Models/GameType";
import { GuessResult } from "../Models/GuessResult";
import { Session } from "../WordleAccessLayer/Session";
import { GamePainter } from "../HtmlPainters/GamePainter";
import { NotificationPainter } from "../HtmlPainters/NotificationPainter";
import { GameplayTranslationInterface } from "../Interfaces/GameplayTranslationInterface";

export class GameplayTranslator implements GameplayTranslationInterface {
    currentWord: string;
    session: Session;

    validAnswers: string[];
    validGuesses: string[];

    gamePainter: GamePainterInterface;
    notificationPainter: NotificationPainter;

    private controlChord: boolean;
    private altChord: boolean;

    private playClickRegistered: boolean;
    private keydownRegistered: boolean;
    private keyupRegistered: boolean;
    private virtualKeyboardRegistered: boolean;

    constructor(validAnswers: string[], validGuesses: string[]) {
        this.controlChord = false;
        this.altChord = false;
        this.currentWord = "";

        this.validAnswers = validAnswers;
        this.validGuesses = validGuesses;

        this.gamePainter = new GamePainter();
        this.notificationPainter = new NotificationPainter();

        this.registerPlayClickEvent();
        this.registerKeydownEvent();
        this.registerKeyupEvent();
        this.registerVirtualKeyboardEvent();
    }

    private registerVirtualKeyboardEvent(): void {
        if (!this.virtualKeyboardRegistered) {
            this.virtualKeyboardRegistered = true;

            const scope = this;

            $(".baseKey, .bigKey").click(function (event) {
                event.preventDefault();
                if (!$("#mainGameContainer").hasClass(domConstants.LOCKED_CLASS_NAME)) {
                    scope.inputLetter($(event.currentTarget).attr("key").toUpperCase());
                }
            });
        }
    }

    private registerPlayClickEvent(): void {
        if (!this.playClickRegistered) {
            this.playClickRegistered = true;

            const scope = this;

            $("#playButton").click(function (event) {
                if (scope.session === undefined || !scope.session.state.active) {
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
                    scope.startSession(gameType, hardMode, maxGuesses, timerEnabled, timerLength);
                }
            });
        }
    }

    private registerKeydownEvent(): void {
        if (!this.keydownRegistered) {
            this.keydownRegistered = true;

            const scope = this;

            $(document).keydown(function (event) {
                const currentKey = event.key.toUpperCase();
                const gameContainerElement = $("#mainGameContainer, #rowsContainer");
                if (!gameContainerElement.hasClass(domConstants.HIDDEN_CLASS_NAME) &&
                    !gameContainerElement.hasClass(domConstants.INVISIBLE_CLASS_NAME) &&
                    !gameContainerElement.hasClass(domConstants.LOCKED_CLASS_NAME)) {
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

    private registerKeyupEvent(): void {
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
            }
        }
    }

    inputLetter(key: string): void {
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
                    $("#playButton").removeClass(domConstants.HIDDEN_CLASS_NAME);
                    //TO DO SHOW SCORING
                } else if (guessResult === GuessResult.GameComplete || guessResult === GuessResult.Progress) {
                    this.currentWord = "";
                }
            }
            else if (isDelete) {
                this.currentWord = this.currentWord.slice(0, -1);
                this.gamePainter.typeLetter("", this.currentWord.length);
            }
        } else if ($("#playButton").has(domConstants.HIDDEN_CLASS_NAME)) {
            this.currentWord = "";
            $("#playButton").removeClass(domConstants.HIDDEN_CLASS_NAME);
        }
    }

    startSession(type: GameType, hardMode: boolean, maxGuesses: number, timerEnabled: boolean, timerLength?: number): void {
        this.currentWord = "";

        this.session = new Session(type, this.validAnswers, this.validAnswers,
            this.notificationPainter.notificationEventing, this.gamePainter, hardMode,
            maxGuesses, timerEnabled, timerLength);
    }
}