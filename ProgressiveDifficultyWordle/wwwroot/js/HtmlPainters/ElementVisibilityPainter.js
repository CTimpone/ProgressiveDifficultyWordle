"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementVisibilityPainter = void 0;
const DOMConstants_1 = require("../Constants/DOMConstants");
class ElementVisibilityPainter {
    constructor() {
        this.registerHelpSelectorClick();
        this.registerSettingsSelectorClick();
        this.registerBoardReturnEvent();
        this.registerNightToggle();
        this.registerGameTypeDetailsClick();
        this.registerTimerInputEvent();
    }
    registerHelpSelectorClick() {
        if (!this.helpSelectorEventRegistered) {
            this.helpSelectorEventRegistered = true;
            $("#helpSelector").click(function () {
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
        }
    }
    registerSettingsSelectorClick() {
        if (!this.settingsSelectorEventRegistered) {
            this.settingsSelectorEventRegistered = true;
            $("#settingsSelector").click(function () {
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
        }
    }
    registerBoardReturnEvent() {
        if (!this.boardReturnEventRegistered) {
            this.boardReturnEventRegistered = true;
            $("#returnToBoard").click(function () {
                $("#settingsContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#helpContainer").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
                $("#keyboard, #rowsContainer").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
                $(".detailsColumn").removeClass(DOMConstants_1.domConstants.INVISIBLE_CLASS_NAME);
                $("#returnToBoard").addClass(DOMConstants_1.domConstants.HIDDEN_CLASS_NAME);
            });
        }
    }
    registerNightToggle() {
        if (!this.nightToggleRegistered) {
            this.nightToggleRegistered = true;
            $("#nightDisplay").click(function () {
                $("body").toggleClass("night");
            });
        }
    }
    registerGameTypeDetailsClick() {
        if (!this.gameTypeDetailsEventRegistered) {
            this.gameTypeDetailsEventRegistered = true;
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
        }
    }
    registerTimerInputEvent() {
        if (!this.timerInputEventRegistered) {
            this.timerInputEventRegistered = true;
            $("#timerEnableToggle").click(function (event) {
                const checked = $(event.currentTarget).find("input").prop("checked");
                $("#timerLengthInput").prop("disabled", !checked);
            });
        }
    }
}
exports.ElementVisibilityPainter = ElementVisibilityPainter;
//# sourceMappingURL=ElementVisibilityPainter.js.map