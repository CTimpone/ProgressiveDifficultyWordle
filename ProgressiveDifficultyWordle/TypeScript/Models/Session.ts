import { GameType } from './GameType';
import { ScoreDetails } from './ScoreDetails';
import { SingleGame } from './SingleGame';
import { SessionState } from './SessionState';
import { NotificationEventing } from './Notification/NotificationEventing';
import { GameOptions } from './GameOptions';
import { EligibleWords } from './EligibleWords';
import { NotificationWrapper } from './Notification/NotificationWrapper';
import { NotificationType } from './Notification/NotificationType';
import { LetterStatus } from './LetterStatus';

export class Session {
    currentGame: SingleGame;
    type: GameType;
    state: SessionState;
    score: ScoreDetails;
    messaging: NotificationEventing;
    boardBinder: (words: string[], letterStatuses: LetterStatus[][]) => void;


    constructor(type: GameType, hardMode: boolean, notificationTools: NotificationEventing,
        fn: (words: string[], letterStatuses: LetterStatus[][]) => void) {
        this.type = type;
        this.messaging = notificationTools;
        this.score = new ScoreDetails();
        this.state = new SessionState(hardMode);
        this.boardBinder = fn;

        this.generateGame();
        this.state.startTime = this.currentGame.startTime;
    }

    generateGame(): void {
        this.currentGame = new SingleGame(this.generateGameOptions(), new EligibleWords(), this.messaging);
    }

    generateGameOptions(): GameOptions {
        return new GameOptions(this.state.hardMode, this.state.maxGuesses, this.state.gameTimerLimitExists, this.state.gameTimerLength);
    }

    next(input: string) {
        if (this.state.active) {
            switch (this.type) {
                case GameType.Endless:
                    if (this.currentGame.solved()) {
                        this.score.updateScore(this.currentGame);
                        this.generateGame();
                        this.updateBoard();
                    } else if (!this.currentGame.solved() && this.currentGame.endTime !== undefined) {
                        if (this.state.active) {
                            this.state.active = false;
                            this.score.updateScore(this.currentGame);
                        }

                        this.messaging.message = new NotificationWrapper(NotificationType.Error,
                            "Unsuccessful solve. To playing, you will need a new session.");
                    } else {
                        this.currentGame.finalizeGuess(input);
                    }
                    break;
                case GameType.ProgressiveDifficulty:
                    throw new Error("Not yet implemented.");
                    break;
                case GameType.Single:
                    if (this.currentGame.endTime !== undefined) {
                        this.messaging.message = new NotificationWrapper(NotificationType.Error,
                            "The game has ended. To continue playing, you will need a new session.");
                    } else {
                        this.currentGame.finalizeGuess(input);
                        this.updateBoard();

                        this.state.active = this.currentGame.endTime === undefined;
                    }
                    break;
                default:
                    const exhaustiveCheck: never = this.type;
                    throw new Error(exhaustiveCheck);
            }
        }
    }

    updateBoard(): void {
        this.boardBinder(this.currentGame.userGuesses.map(guess => guess.guess),
            this.currentGame.userGuesses.map(guess => guess.characterStates));
    }
}