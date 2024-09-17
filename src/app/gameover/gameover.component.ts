import { Component, Input, OnInit } from "@angular/core";
import score from "../models/score";

@Component({
  selector: "app-gameover",
  templateUrl: "./gameover.component.html",
  styleUrls: ["./gameover.component.css"],
})
export class GameoverComponent implements OnInit {
  @Input() score: string | undefined;

  name: string = '';
  points: number = 0;
  scoreObj: score | undefined;
  showError: boolean = false;

  constructor() {}

  ngOnInit(): void {
  }

  recieveName(valueEmitted: string) {
    this.name = valueEmitted;
    this.showError = false;
  }

  saveScore() {
    if (!this.name) {
      this.showError = true;
      console.log('No name');
      return;
    }
    console.log('Name present');
    this.scoreObj = {
      name: this.name,
      score: this.points,
    };
  }
}
