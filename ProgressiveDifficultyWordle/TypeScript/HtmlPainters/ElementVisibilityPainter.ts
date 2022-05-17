import { getCookie, setCookie } from "typescript-cookie";

import { domConstants } from "../Constants/DOMConstants";
import { cookieConstants } from '../Constants/CookieConstants';

import { ScorePainterInterface } from "../Interfaces/ScorePainterInterface";
import { GameType } from "../Models/GameType";

export class ElementVisibilityPainter {
    private scorePainter: ScorePainterInterface;

    private helpSelectorEventRegistered: boolean;
    private settingsSelectorEventRegistered: boolean;
    private scoresSelectorEventRegistered: boolean;

    private boardReturnEventRegistered: boolean;
    private nightToggleRegistered: boolean;

    private gameTypeDetailsEventRegistered: boolean;
    private gameTypeScoreHistoryEventRegistered: boolean;

    private timerInputEventRegistered: boolean;

    private preventFormDefaultsRegistered: boolean;

    constructor(scorePainter: ScorePainterInterface) {
        this.scorePainter = scorePainter;

        this.preventFormDefaults();

        this.registerHelpSelectorClick();
        this.registerSettingsSelectorClick();
        this.registerScoresSelectorClick();

        this.registerBoardReturnEvent();
        this.registerNightToggle();
        this.registerGameTypeDetailsClick();
        this.registerGameTypeScoreDetailsClick();
        this.registerTimerInputEvent();

        const nightCookie = getCookie(cookieConstants.NIGHT_COOKIE_NAME);
        const currentDarkMode = nightCookie !== undefined && nightCookie.toLowerCase() === "true";
        this.handleDarkMode(currentDarkMode);
    }

    preventFormDefaults() {
        if (!this.preventFormDefaultsRegistered) {
            this.preventFormDefaultsRegistered = true;

            $("form").submit(function (event) {
                event.preventDefault();
            });
        }
    }

    private handleDarkMode(inDarkMode: boolean) {
        if (inDarkMode) {
            $("body").addClass("night");

            $("#nightDisplay").prop("checked", true);
        } else {
            $("body").removeClass("night");

            $("#nightDisplay").prop("checked", false);
        }

        setCookie(cookieConstants.NIGHT_COOKIE_NAME, inDarkMode, { expires: 365 });
    }

    private registerHelpSelectorClick() {
        if (!this.helpSelectorEventRegistered) {
            this.helpSelectorEventRegistered = true;

            $("#helpSelector").click(function () {
                $("#settingsContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scoreContainer").addClass(domConstants.HIDDEN_CLASS_NAME);

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
        }
    }

    private registerSettingsSelectorClick() {
        if (!this.settingsSelectorEventRegistered) {
            this.settingsSelectorEventRegistered = true;

            $("#gameTypeSelector1").prop("checked", true);

            $("#settingsSelector").click(function () {
                $("#helpContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scoreContainer").addClass(domConstants.HIDDEN_CLASS_NAME);

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
        }
    }

    private registerScoresSelectorClick() {
        if (!this.scoresSelectorEventRegistered) {
            this.scoresSelectorEventRegistered = true;

            $("#gameTypeScoreSelector1").prop("checked", true);

            const scope = this;

            $("#scoreHistorySelector").click(function () {
                $("#helpContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#settingsContainer").addClass(domConstants.HIDDEN_CLASS_NAME);

                if ($("#scoreContainer").hasClass(domConstants.HIDDEN_CLASS_NAME)) {
                    $("#scoreContainer").removeClass(domConstants.HIDDEN_CLASS_NAME);
                    $("#keyboard, #rowsContainer").addClass(domConstants.INVISIBLE_CLASS_NAME);
                    $(".detailsColumn").addClass(domConstants.INVISIBLE_CLASS_NAME);
                    $("#returnToBoard").removeClass(domConstants.HIDDEN_CLASS_NAME);

                    scope.paintScoreSection($("#settingsContainer .radioContainer input:checked").val().toString())
                } else {
                    $("#scoreContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
                    $("#keyboard, #rowsContainer").removeClass(domConstants.INVISIBLE_CLASS_NAME);
                    $(".detailsColumn").removeClass(domConstants.INVISIBLE_CLASS_NAME);
                    $("#returnToBoard").addClass(domConstants.HIDDEN_CLASS_NAME);
                }
            });
        }
    }


    private registerBoardReturnEvent() {
        if (!this.boardReturnEventRegistered) {
            this.boardReturnEventRegistered = true;

            $("#returnToBoard").click(function () {
                $("#settingsContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#helpContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scoreContainer").addClass(domConstants.HIDDEN_CLASS_NAME);

                $("#keyboard, #rowsContainer").removeClass(domConstants.INVISIBLE_CLASS_NAME);
                $(".detailsColumn").removeClass(domConstants.INVISIBLE_CLASS_NAME);
                $("#returnToBoard").addClass(domConstants.HIDDEN_CLASS_NAME);

            });

        }
    }

    private registerNightToggle() {
        if (!this.nightToggleRegistered) {
            this.nightToggleRegistered = true;

            const scope = this;
            $("#nightDisplay").click(function () {
                $("body").toggleClass("night");

                scope.handleDarkMode($("body").hasClass("night"));
            });
        }
    }

    private registerGameTypeDetailsClick() {
        if (!this.gameTypeDetailsEventRegistered) {
            this.gameTypeDetailsEventRegistered = true;

            $("#settingsContainer .radioContainer label").click(function (event) {
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
        }
    }

    registerGameTypeScoreDetailsClick() {
        if (!this.gameTypeScoreHistoryEventRegistered) {
            this.gameTypeScoreHistoryEventRegistered = true;

            const scope = this;
            $("#scoreContainer .radioContainer label").click(function (event) {
                const gameType = $(`#${$(event.currentTarget).attr("for")}`).val().toString();
                scope.paintScoreSection(gameType);
            });
        }
    }

    private paintScoreSection(type: string) {
        let gameType: GameType;
        switch (type) {
            case "endless":
                $("#singleScoreHistory").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#endlessScoreHistory").removeClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scalingScoreHistory").addClass(domConstants.HIDDEN_CLASS_NAME);
                gameType = GameType.Endless;
                break;
            case "scaling":
                $("#singleScoreHistory").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#endlessScoreHistory").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scalingScoreHistory").removeClass(domConstants.HIDDEN_CLASS_NAME);
                gameType = GameType.ProgressiveDifficulty;
                break;
            case "single":
            default:
                $("#singleScoreHistory").removeClass(domConstants.HIDDEN_CLASS_NAME);
                $("#endlessScoreHistory").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#scalingScoreHistory").addClass(domConstants.HIDDEN_CLASS_NAME);
                gameType = GameType.Single;
                break;
        }

        this.scorePainter.paintScores(gameType);
    }

    private registerTimerInputEvent() {
        if (!this.timerInputEventRegistered) {
            this.timerInputEventRegistered = true;

            $("#timerEnableToggle").click(function (event) {
                const checked = $(event.currentTarget).find("input").prop("checked");
                $("#timerLengthInput").prop("disabled", !checked);
            });
        }
    }

}