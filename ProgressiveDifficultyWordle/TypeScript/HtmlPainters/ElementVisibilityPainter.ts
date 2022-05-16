import { domConstants } from "../Constants/DOMConstants";
import { cookieConstants } from '../Constants/CookieConstants';
import { getCookie, removeCookie, setCookie } from "typescript-cookie";

export class ElementVisibilityPainter {

    private helpSelectorEventRegistered: boolean;
    private settingsSelectorEventRegistered: boolean;
    private boardReturnEventRegistered: boolean;
    private nightToggleRegistered: boolean;
    private gameTypeDetailsEventRegistered: boolean;
    private timerInputEventRegistered: boolean;

    constructor() {
        this.registerHelpSelectorClick();
        this.registerSettingsSelectorClick();
        this.registerBoardReturnEvent();
        this.registerNightToggle();
        this.registerGameTypeDetailsClick();
        this.registerTimerInputEvent();

        this.handleDarkMode(Boolean(getCookie(cookieConstants.NIGHT_COOKIE_NAME)));
    }

    private handleDarkMode(inDarkMode: boolean) {
        if (inDarkMode) {
            $("body").addClass("night");
        } else {
            $("body").removeClass("night");
        }

        removeCookie(cookieConstants.NIGHT_COOKIE_NAME);
        setCookie(cookieConstants.NIGHT_COOKIE_NAME, inDarkMode, { expires: 365 });
    }

    private registerHelpSelectorClick() {
        if (!this.helpSelectorEventRegistered) {
            this.helpSelectorEventRegistered = true;

            $("#helpSelector").click(function () {
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
        }
    }

    private registerSettingsSelectorClick() {
        if (!this.settingsSelectorEventRegistered) {
            this.settingsSelectorEventRegistered = true;

            $("#settingsSelector").click(function () {
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
        }
    }

    private registerBoardReturnEvent() {
        if (!this.boardReturnEventRegistered) {
            this.boardReturnEventRegistered = true;

            $("#returnToBoard").click(function () {
                $("#settingsContainer").addClass(domConstants.HIDDEN_CLASS_NAME);
                $("#helpContainer").addClass(domConstants.HIDDEN_CLASS_NAME);

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
        }
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