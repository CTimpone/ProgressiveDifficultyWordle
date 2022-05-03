import { GameType } from './GameType';
import { ScoreDetails } from './ScoreDetails';
import { SingleGame } from './SingleGame';
import { SessionState } from './SessionState';
import { NotificationEventing } from './Notification/NotificationEventing';
import { GameOptions } from './GameOptions';
import { EligibleWords } from './EligibleWords';
import { NotificationWrapper } from './Notification/NotificationWrapper';
import { NotificationType } from './Notification/NotificationType';
import { DomManipulator } from '../Interfaces/DomManipulator';
import { GuessResult } from './GuessResult';

export class Session {
    private currentGame: SingleGame;
    private eligibleWords: EligibleWords;
    private domManipulator: DomManipulator;
    type: GameType;
    state: SessionState;
    score: ScoreDetails;
    messaging: NotificationEventing;

    constructor(type: GameType, hardMode: boolean, eligibleAnswers: string[], eligibleGuesses: string[],
        notificationTools: NotificationEventing, domManipulator: DomManipulator) {
        this.type = type;
        this.messaging = notificationTools;
        this.score = new ScoreDetails();
        this.state = new SessionState(hardMode);
        this.domManipulator = domManipulator;
        this.eligibleWords = new EligibleWords(eligibleAnswers, eligibleGuesses);

        this.generateGame();
        this.state.startTime = this.currentGame.startTime;
    }

    next(input: string): GuessResult {
        let guessResult;
        if (this.state.active) {
            if (this.type === GameType.Single) {
                guessResult = this.currentGame.guessTrigger(input);

                if (!this.isCurrentGameActive()) {
                    this.score.updateScore(this.currentGame);
                    this.paintDetails();
                }
            } else {
                guessResult = this.currentGame.guessTrigger(input);

                if (this.currentGame.solved()) {
                    this.anotherGame();
                } else if (!this.isCurrentGameActive()) {
                    this.messaging.message = new NotificationWrapper(NotificationType.Error,
                        `The answer was '${this.currentGame.chosenWord.toUpperCase()}. Create a new session to play again.'`);
                }
            }
        } else {
            this.messaging.message = new NotificationWrapper(NotificationType.Error,
                "The session has ended. To keep playing, you will need a new session.");
        }

        if (guessResult === GuessResult.Progress || guessResult === GuessResult.GameComplete) {
            this.paintBoard();
        }

        return guessResult;
    }

    isCurrentGameNew(): boolean {
        return this.currentGame !== undefined && this.currentGame.userGuesses.length === 0;
    }

    isCurrentGameActive(): boolean {
        this.state.active = this.currentGame.endTime === undefined;

        return this.state.active;
    }

    paintBoard(game?: SingleGame, onlyPaintLast?: boolean): void {
        game = game ?? this.currentGame;

        onlyPaintLast = onlyPaintLast ?? false;
        this.domManipulator.paintBoard(game.userGuesses.map(guess => guess.guess),
            game.userGuesses.map(guess => guess.characterStates), onlyPaintLast, game.endTime === undefined);
    }

    private generateGame(): void {
        this.currentGame = new SingleGame(this.generateGameOptions(), this.eligibleWords, this.messaging,
            this.domManipulator, true);

        this.paintDetails();
        this.domManipulator.truncateBoard(this.currentGame.options.maxGuesses);
    }

    private generateGameOptions(): GameOptions {
        return new GameOptions(this.state.hardMode,
            this.state.maxGuesses,
            this.state.gameTimerLimitExists,
            this.state.gameTimerLength);
    }

    private paintDetails(): void {
        this.domManipulator.paintDetails(this.type, this.state, this.score);
    }

    private anotherGame(): void {
        this.state.gameHistory.push(this.currentGame);
        this.score.updateScore(this.currentGame);

        if (this.type === GameType.ProgressiveDifficulty) {
            this.state.getHarder(this.score.roundsCompleted);
        }

        this.generateGame();

        this.paintBoard();
    }
}