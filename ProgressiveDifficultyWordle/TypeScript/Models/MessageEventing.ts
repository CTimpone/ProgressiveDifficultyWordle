export class MessageEventing {
    internalMessage: string;
    internalEventListener: (arg0: string) => void;

    set message(value: string) {
        this.internalMessage = value;
        this.internalEventListener(value);
    }

    get message(): string {
        return this.internalMessage;
    }

    registerListener(fn: (arg0: string) => void): void {
        this.internalEventListener = fn;
    }
}
