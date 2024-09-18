import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";
import fetchFromSpotify from "../../services/api";

type Genre = "Pop" | "Rock" | "Jpop"; // Add other genres as needed.

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"],
})
export class PlayComponent implements OnInit {
  track: any;
  options: string[] = [];
  correctArtist: string = "";
  genre: string = "";
  token: string = "";
  audio: HTMLAudioElement | null = null;
  volume: number = 0.5;
  selectedAnswer: string | null = null;
  routerSubscription: Subscription | null = null;
  points: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Using ActivatedRoute to access navigation state
    this.route.paramMap.subscribe((params) => {
      const state = history.state as {
        track: any;
        options: string[];
        correctArtist: string;
        genre: Genre;
        token: string;
      };

      if (state) {
        console.log("Play component received state:", state);
        this.track = state.track;
        this.options = state.options;
        this.correctArtist = state.correctArtist;
        this.genre = state.genre;
        this.token = state.token;
      } else {
        console.log("No state found, redirecting to home");
        this.router.navigate(["/"]);
      }
    });

    // Subscribe to router events to pause audio on navigation
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.audio){
          this.audio.pause();
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from router events to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  pauseAudio() {
    throw new Error("Method not implemented.");
  }

  playAudio() {
    // const audio = new Audio(this.track.preview_url);
    // audio.play();
    if (this.audio) {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    } else {
      this.audio = new Audio(this.track.preview_url);
      this.audio.volume = this.volume;
      this.audio.play();
    }
  }

  setVolume(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const volume = parseFloat(inputElement.value);
      if (!isNaN(volume)) {
        this.volume = volume;
        if (this.audio) {
          this.audio.volume = this.volume;
        }
        // console.log("Volume changed to:", this.volume);
      }
    }
  }

  setAnswer(option: string): void {
    if (!this.selectedAnswer) {
      this.selectedAnswer = option;
    }
  }

  handleContinue(): void {
    // if the answer is correct, next round
    if (this.selectedAnswer === this.correctArtist) {
      this.points += 1;
      console.log('Correct answer! Points:', this.points);
      this.loadNewTrack();
    }
    // else game over
    else {
      console.log('Incorrect answer. Navigating to gameover with points:', this.points);
      this.router.navigate(["gameover"], { state: { points: this.points } });
    }
  }

  loadNewTrack() {
    this.selectedAnswer = null;
    const artistList = this.getArtistList(this.genre as Genre);
    const randomArtist =
      artistList[Math.floor(Math.random() * artistList.length)];
    const endpoint = `search`;
    const params = {
      q: `artist:${randomArtist}`,
      type: "track",
      limit: 1,
    };

    fetchFromSpotify({ token: this.token, endpoint, params })
      .then((data: any) => {
        const newTrack = data.tracks.items[0];
        if (newTrack && newTrack.preview_url) {
          this.setupNewGameRound(newTrack, artistList);
        } else {
          console.error("No track preview available for the selected artist.");
          this.loadNewTrack(); // Retry if no preview is available
        }
      })
      .catch((error: any) => {
        console.error("Error fetching tracks:", error);
      });
  }

  setupNewGameRound(track: any, artistList: string[]) {
    this.track = track;
    this.correctArtist = track.artists[0].name;
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(this.track.preview_url);
    this.audio.volume = this.volume;

    const numOptions = this.getNumberOfChoices();
    const wrongChoices = artistList.filter(
      (artist) => artist !== this.correctArtist
    );
    const shuffledChoices = this.shuffleArray([...wrongChoices]).slice(
      0,
      numOptions - 1
    );
    shuffledChoices.push(this.correctArtist);

    this.options = this.shuffleArray(shuffledChoices);
  }

  getArtistList(genre: Genre): string[] {
    const artistList: Record<Genre, string[]> = {
      Pop: ["Katy Perry", "Taylor Swift", "Justin Bieber"],
      Rock: ["Led Zeppelin", "AC/DC", "Queen"],
      Jpop: ["Ado", "Yorushika", "Reol", "Aimer"]
      // Add other genres and artists here
    };

    return artistList[genre] || [];
  }

  getNumberOfChoices() {
    // This should be passed from the home component
    switch (this.options.length) {
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 5;
      default:
        return 4;
    }
  }

  buttonColorControl(option: string): string {
    // if the user has not selected an answer, return a blank class
    if (!this.selectedAnswer) {
      return "";
    }
    // if the user has selected an answer, return the appropriate class
    if (option === this.selectedAnswer) {
      return this.selectedAnswer === this.correctArtist
        ? "correct"
        : "incorrect";
    }
    // if the user has not selected the answer, return the correct class
    if (option === this.correctArtist) {
      return "correct";
    }
    // if the user has not selected the answer, return a blank class
    return "";
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
