import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  showError: boolean = false;
  genres: String[] = [];
  selectedGenre: String = "";
  selectedDifficulty = "medium";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";

  constructor(private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      genre: ["", Validators.required],
      difficulty: [this.selectedDifficulty, Validators.required],
    });
  }

  ngOnInit(): void {
    // Subscribe to valueChanges to call setGenre() whenever the genre changes
    this.form.get("genre")?.valueChanges.subscribe((value) => {
      this.setGenre(value);
    });

    // Subscribe to valueChanges to call setDifficulty() whenever the difficulty changes
    this.form.get("difficulty")?.valueChanges.subscribe((value) => {
      this.setDifficulty(value);
    });

    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    this.genres = ["Pop", "Rock", "J-pop", "Country", "HipHop", "EDM"];
    this.configLoading = false;
  };

  setGenre(value: string): void {
    this.selectedGenre = value;
    // hide error message if genre is selected
    if (value) {
      this.showError = false;
    }
  }

  setDifficulty(value: string): void {
    this.selectedDifficulty = value;
    console.log(this.selectedDifficulty);
  }
  startGame() {
    if (this.form.valid) {
      this.playGame();
    } else {
      this.showError = true;
    }
  }
  playGame(){
    console.log("Navigating to play with state:", {
      difficulty: this.selectedDifficulty,
      genre: this.selectedGenre,
      token: this.token,
    });
    this.router.navigate(['play'],{
      state: {
        choices: this.getNumberOfChoices(),
        genre: this.selectedGenre,
        token: this.token
      }
    })
  }
  getNumberOfChoices() {
    switch (this.selectedDifficulty) {
      case 'easy':
        return 3;
      case 'medium':
        return 4;
      case 'hard':
        return 5;
      default:
        return 4;
    }
  }
}
