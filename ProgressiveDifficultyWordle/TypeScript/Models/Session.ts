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
    private currentGame: SingleGame;
    private boardBinder: (words: string[], letterStatuses: LetterStatus[][]) => void;
    private eligibleAnswers: string[];
    private eligibleGuesses: string[];

    type: GameType;
    state: SessionState;
    score: ScoreDetails;
    messaging: NotificationEventing;

    constructor(type: GameType, hardMode: boolean, eligibleAnswers: string[], eligibleGuesses: string[],
        notificationTools: NotificationEventing,
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
        this.currentGame = new SingleGame(this.generateGameOptions(),
            new EligibleWords(this.eligibleAnswers, this.eligibleGuesses), this.messaging);
    }

    generateGameOptions(): GameOptions {
        return new GameOptions(this.state.hardMode,
            this.state.maxGuesses,
            this.state.gameTimerLimitExists,
            this.state.gameTimerLength);
    }

    next(input: string) {
        if (this.state.active) {
            if (this.type === GameType.Single) {
                this.currentGame.finalizeGuess(input);
                this.paintBoard();

                this.state.active = this.currentGame.endTime === undefined;
            } else {
                this.currentGame.finalizeGuess(input);
                this.paintBoard();

                if (this.currentGame.solved()) {
                    this.anotherGame();
                } else if (this.currentGame.endTime) {
                    this.state.active = false;

                    this.messaging.message = new NotificationWrapper(NotificationType.Error,
                        "Unsuccessfully solved. To keep playing, you will need a new session.");
                }
            }
        } else {
            this.messaging.message = new NotificationWrapper(NotificationType.Error,
                "The session has ended. To keep playing, you will need a new session.");

        }
    }

    anotherGame(): void {
        this.state.gameHistory.push(this.currentGame);
        this.score.updateScore(this.currentGame);

        if (this.type === GameType.ProgressiveDifficulty) {
            this.state.getHarder(this.score.roundsCompleted);
        }

        this.generateGame();
        this.paintBoard();
    }

    paintBoard(game?: SingleGame): void {
        game = game ?? this.currentGame;
        this.boardBinder(game.userGuesses.map(guess => guess.guess),
            game.userGuesses.map(guess => guess.characterStates));
    }
}