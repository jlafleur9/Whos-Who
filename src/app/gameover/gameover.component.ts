import { Component, OnInit } from "@angular/core";
import score from "../models/score";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-gameover",
  templateUrl: "./gameover.component.html",
  styleUrls: ["./gameover.component.css"],
})
export class GameoverComponent implements OnInit {
  points: number = 0;

  name: string = "";
  scoreObj: score | undefined;
  leaderboardForm: FormGroup;
  targetRoute: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.leaderboardForm = this.fb.group({
      name: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // i dont know why this.router.getCurrentNavigation() returns null and i can't figure it out
    // so instead i used like how it is handled in play.component using ActivatedRoute to access navigation state
    this.route.paramMap.subscribe((params) => {
      const state = history.state as {
        points: number;
      };
    
      if (state) {
        console.log("Gameover component received state:", state);
        this.points = state.points;
      }
    });

    // // seeder scores for testing
    // let scores: score[] = [
    //   { name: 'John', score: 100 },
    //   { name: 'Jane', score: 200 },
    //   { name: 'Doe', score: 300 },
    //   { name: 'Smith', score: 400 },
    //   { name: 'Doe', score: 500 },
    // ];
    // localStorage.setItem('scores', JSON.stringify(scores));
  }

  saveScore(targetRoute: string) {
    // check if the form is valid
    if (this.leaderboardForm.invalid) {
      this.leaderboardForm.markAllAsTouched();
      return;
    }
    // get the name from the form
    const name = this.leaderboardForm.get("name")?.value;
    this.scoreObj = {
      name: name,
      score: this.points,
    };

    // check if there exists an object in local storage that contains a list of scores
    // if there is an object, push the new score to the list
    // else, create a new object and push the score to the list
    let scores: score[] = [];
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
      scores = JSON.parse(storedScores);
    } else {
      scores = [];
    }

    // sort the scores in descending order
    scores.sort((a, b) => b.score - a.score);

    // if the scores list is greater than 5 and the current score is greater than the last score in the list, remove the last score and push the new score
    if (scores.length >= 5 && this.points > scores[scores.length - 1].score) {
      scores.pop();
      scores.push(this.scoreObj);
    } else if (scores.length < 5) {
      scores.push(this.scoreObj);
    }

    // sort the scores in descending order
    scores.sort((a, b) => b.score - a.score);

    localStorage.setItem("scores", JSON.stringify(scores));

    console.log(scores);

    this.router.navigate([targetRoute]);
  }
}
