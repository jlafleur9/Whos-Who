import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import fetchFromSpotify from '../../services/api';

type Genre = 'pop' | 'rock'; // Add other genres as needed


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  track: any;
  options: string[] = [];
  correctArtist: string = "";
  genre: string = "";
  token: string = "";

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { track: any; options: string[]; correctArtist: string; genre: string; token: string };

    if (state) {
      console.log(state)
      this.track = state.track;
      this.options = state.options;
      this.correctArtist = state.correctArtist;
      this.genre = state.genre;
      this.token = state.token;
    } else {
      console.log(state)
      this.router.navigate(['/']);
    }
  }

  playAudio() {
    const audio = new Audio(this.track.preview_url);
    audio.play();
  }

  checkAnswer(selectedArtist: string) {
    if (selectedArtist === this.correctArtist) {
      alert("Correct! Let's continue...");
      this.loadNewTrack();
    } else {
      alert(`Wrong! The correct answer was ${this.correctArtist}`);
      // End the game or navigate to the leaderboard or home
    }
  }

  loadNewTrack() {
    const artistList = this.getArtistList(this.genre as Genre);
    const randomArtist = artistList[Math.floor(Math.random() * artistList.length)];
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

    const numOptions = this.getNumberOfChoices();
    const wrongChoices = artistList.filter(artist => artist !== this.correctArtist);
    const shuffledChoices = this.shuffleArray([...wrongChoices]).slice(0, numOptions - 1);
    shuffledChoices.push(this.correctArtist);

    this.options = this.shuffleArray(shuffledChoices);
  }

  getArtistList(genre: Genre): string[] {
    const artistList: Record<Genre, string[]> = {
      pop: ["Katy Perry", "Taylor Swift", "Justin Bieber"],
      rock: ["Led Zeppelin", "AC/DC", "Queen"],
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

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
