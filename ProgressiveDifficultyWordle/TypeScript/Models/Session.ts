import { GameType } from './GameType';
import { ScoreDetails } from './ScoreDetails';
import { SingleGame } from './SingleGame';
import { SessionState } from './SessionState';
import { NotificationEventing } from './Notification/NotificationEventing';

export class Session {
    currentGame: SingleGame;
    type: GameType;
    state: SessionState;
    score: ScoreDetails;
    notify: NotificationEventing;

    constructor(type: GameType, notificationTools: NotificationEventing) {
        this.type = type;
        this.notify = notificationTools;
    }
}