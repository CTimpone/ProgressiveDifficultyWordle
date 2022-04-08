"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEventing = void 0;
class NotificationEventing {
    set message(value) {
        this.internalMessage = value;
        this.internalEventListener(value);
    }
    get message() {
        return this.internalMessage;
    }
    registerListener(fn) {
        this.internalEventListener = fn;
    }
}
exports.NotificationEventing = NotificationEventing;
//# sourceMappingURL=NotificationEventing.js.map