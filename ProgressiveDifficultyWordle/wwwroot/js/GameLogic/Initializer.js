"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameType_1 = require("../Models/GameType");
const NotificationEventing_1 = require("../Models/Notification/NotificationEventing");
const Session_1 = require("../Models/Session");
$(document).ready(function () {
    const notifications = new NotificationEventing_1.NotificationEventing();
    const notifyFn = (notification) => {
        console.log("Not yet implemented.");
    };
    notifications.registerListener(notifyFn);
    const paintFn = (words, letterStatuses) => {
        console.log("Not yet implemented.");
    };
    const session = new Session_1.Session(GameType_1.GameType.Single, false, notifications, paintFn);
    console.log("Not yet implemented.");
});
//# sourceMappingURL=Initializer.js.map