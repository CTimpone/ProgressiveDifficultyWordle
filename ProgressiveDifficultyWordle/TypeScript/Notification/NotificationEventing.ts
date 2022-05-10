import { NotificationWrapper } from "./NotificationWrapper";

export class NotificationEventing {
    internalMessage: NotificationWrapper;
    internalEventListener: (notification: NotificationWrapper) => void;

    set message(value: NotificationWrapper) {
        this.internalMessage = value;
        console.log(`{"messageType": "${value.type.toString()}", "message": "${value.message}"}`);
        this.internalEventListener(value);
    }

    get message(): NotificationWrapper {
        return this.internalMessage;
    }

    registerListener(fn: (notification: NotificationWrapper) => void): void {
        this.internalEventListener = fn;
    }
}
