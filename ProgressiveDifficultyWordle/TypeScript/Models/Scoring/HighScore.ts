import { ScoreDetails } from "../../WordleAccessLayer/ScoreDetails";

export class HighScore {
    score: number;
    roundsCompleted: number;
    date: Date;

    constructor(details: ScoreDetails) {
        this.score = details.totalScore;
        this.roundsCompleted = details.roundsCompleted;
        this.date = details.endTime;
    }
}