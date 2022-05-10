import { NotificationType } from "../Models/NotificationType";

export class NotificationWrapper {
    message: string;
    type: NotificationType

    static readonly REPLACEMENT = /REPLACEMENT=>text/g;

    constructor(type: NotificationType, text: string) {
        this.message = text;
        this.type = type;
    }

    static interpolateMessage(baseMessage: string, interpolated: string): string {
        return baseMessage.replace(this.REPLACEMENT, interpolated);
    }
}