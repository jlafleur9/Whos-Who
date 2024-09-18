import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Router } from '@angular/router';

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  genres: String[] = [];
  selectedGenre: String = "";
  selectedDifficulty = "medium"
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";
  artistList: {[key: string]: string[]} = {
    Pop: ["Taylor Swift", "Justin Bieber"],
    Rock: ["Led Zeppelin", "AC/DC", "Queen", "Beyoncé"]
  };

  ngOnInit(): void {
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
    this.genres = [
      'Pop',
      'Rock'
    ]
    this.configLoading = false;
  }

  setGenre(selectedGenre: any){
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
    //console.log(TOKEN_KEY);
  }

  setDifficulty(selectedDifficulty: any){
    this.selectedDifficulty = selectedDifficulty;
    console.log(this.selectedDifficulty)
  }
  startGame() {
    if (!this.selectedGenre || !this.selectedDifficulty) {
      return;
    }

    this.fetchTracks();
  }

  fetchTracks(){
    const artists = this.artistList[this.selectedGenre as string]
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const endpoint = `search`;
    const params = {
      q: `artist:${randomArtist}`,
      type: "track",
      limit: 1,
    };

    fetchFromSpotify({ token: this.token, endpoint, params })
      .then((data: any) => {
        const track = data.tracks.items[0];
        if (track && track.preview_url) {
          this.navigateToPlayPage(track, artists);
        } else {
          console.error("No track preview available for the selected artist.");
        }
      })
      .catch((error: any) => {
        console.error("Error fetching tracks:", error);
      });
  }

  navigateToPlayPage(track: any, artists: string[]) {
    const numOptions = this.getNumberOfChoices();
    const correctArtist = track.artists[0].name;
  
    const wrongChoices = artists.filter(artist => artist !== correctArtist);
    const shuffledChoices = this.shuffleArray([...wrongChoices]).slice(0, numOptions - 1);
    shuffledChoices.push(correctArtist);
  
    const options = this.shuffleArray(shuffledChoices);
  
    console.log("Navigating to play with state:", {
      track: track,
      options: options,
      correctArtist: correctArtist,
      genre: this.selectedGenre,
      token: this.token
    });
  
    this.router.navigate(['play'], {
      state: { 
        track: track,
        options: options,
        correctArtist: correctArtist,
        genre: this.selectedGenre,
        token: this.token 
      }
    });
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

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}

  //Im going to leave the code they provided in comments bellow if in case we need it

  // loadGenres = async (t: any) => {
  //   this.configLoading = true;

  //   // #################################################################################
  //   // DEPRECATED!!! Use only for example purposes
  //   // DO NOT USE the recommendations endpoint in your application
  //   // Has been known to cause 429 errors
  //   // const response = await fetchFromSpotify({
  //   //   token: t,
  //   //   endpoint: "recommendations/available-genre-seeds",
  //   // });
  //   // console.log(response);
  //   // #################################################################################
    
  //   this.genres = [
  //     "rock",
  //     "rap",
  //     "pop",
  //     "country",
  //     "hip-hop",
  //     "jazz",
  //     "alternative",
  //     "j-pop",
  //     "k-pop",
  //     "emo"
  //   ]
  //   this.configLoading = false;
  // };

  // setGenre(selectedGenre: any) {
  //   this.selectedGenre = selectedGenre;
  //   console.log(this.selectedGenre);
  //   console.log(TOKEN_KEY);
  // }

