import { GameType } from '../Models/GameType';
import { LetterStatus } from '../Models/LetterStatus';
import { NotificationEventing } from '../Models/Notification/NotificationEventing';
import { NotificationWrapper } from '../Models/Notification/NotificationWrapper';
import { Session } from '../Models/Session';

$(document).ready(function () {
    const notifications = new NotificationEventing();
    const notifyFn = (notification: NotificationWrapper) => {
        console.log("Not yet implemented.");
    };
    notifications.registerListener(notifyFn);

    const paintFn = (words: string[], letterStatuses: LetterStatus[][]) => {
        console.log("Not yet implemented.");
    };
    const session = new Session(GameType.Single, false, notifications, paintFn);

    console.log("Not yet implemented.");

});