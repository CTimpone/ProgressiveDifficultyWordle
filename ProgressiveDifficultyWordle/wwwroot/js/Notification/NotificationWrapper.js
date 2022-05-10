"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationWrapper = void 0;
class NotificationWrapper {
    constructor(type, text) {
        this.message = text;
        this.type = type;
    }
    static interpolateMessage(baseMessage, interpolated) {
        return baseMessage.replace(this.REPLACEMENT, interpolated);
    }
}
exports.NotificationWrapper = NotificationWrapper;
NotificationWrapper.REPLACEMENT = /REPLACEMENT=>text/g;
//# sourceMappingURL=NotificationWrapper.js.map