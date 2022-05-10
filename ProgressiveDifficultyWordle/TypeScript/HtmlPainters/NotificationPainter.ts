import { domConstants } from "../Constants/DOMConstants";
import { NotificationEventing } from "../Notification/NotificationEventing";
import { NotificationType } from "../Models/NotificationType";
import { NotificationWrapper } from "../Notification/NotificationWrapper";

export class NotificationPainter {
    notificationEventing: NotificationEventing;
    
    constructor() {
        this.notificationEventing = new NotificationEventing();

        this.notificationEventing.registerListener(this.paint);
    }

    private paint(notification: NotificationWrapper): void {
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
    }
}