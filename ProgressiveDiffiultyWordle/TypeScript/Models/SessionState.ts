namespace PDW {
    export class SessionState {
        GameHistory: SingleGame[] | undefined;
        Active: boolean;
        StartTime: Date;
        HardMode: boolean;
        GameTimerLength: number | undefined;
        MaxGuesses: number;
    }
}