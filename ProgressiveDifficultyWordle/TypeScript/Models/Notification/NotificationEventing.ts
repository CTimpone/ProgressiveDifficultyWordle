import { NotificationWrapper } from "./NotificationWrapper";

export class NotificationEventing {
    internalMessage: NotificationWrapper;
    internalEventListener: (arg0: NotificationWrapper) => void;

    set message(value: NotificationWrapper) {
        this.internalMessage = value;
        this.internalEventListener(value);
    }

    get message(): NotificationWrapper {
        return this.internalMessage;
    }

    registerListener(fn: (arg0: NotificationWrapper) => void): void {
        this.internalEventListener = fn;
    }
}
