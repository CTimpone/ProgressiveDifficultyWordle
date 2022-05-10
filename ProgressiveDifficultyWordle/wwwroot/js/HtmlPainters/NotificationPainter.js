"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPainter = void 0;
const DOMConstants_1 = require("../Constants/DOMConstants");
const NotificationEventing_1 = require("../Notification/NotificationEventing");
const NotificationType_1 = require("../Models/NotificationType");
class NotificationPainter {
    constructor() {
        this.notificationEventing = new NotificationEventing_1.NotificationEventing();
        this.notificationEventing.registerListener(this.paint);
    }
    paint(notification) {
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
    }
}
exports.NotificationPainter = NotificationPainter;
//# sourceMappingURL=NotificationPainter.js.map