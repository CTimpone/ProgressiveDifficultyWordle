"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
class Session {
    constructor() {
    }
    paintBoard(words, letterStatuses, onlyPaintLast) {
        const length = words.length;
        for (let i = 0; i < length; i++) {
            if (i === length - 1 || onlyPaintLast !== true) {
                const currentWord = words[i];
                const statuses = letterStatuses[i];
            }
        }
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map