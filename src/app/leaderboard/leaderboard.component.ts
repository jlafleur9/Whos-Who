import { Component, OnInit } from "@angular/core";
import score from "../models/score";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  scores: score[] = [];

  constructor() {}

  ngOnInit(): void {
    this.scores = this.getScores();
  }

  // get the scores from the local storage
  getScores(): score[] {
    const scores = localStorage.getItem("scores");
    return scores ? JSON.parse(scores) : [];
  }
}
