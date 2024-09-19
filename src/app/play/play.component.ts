import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";
import fetchFromSpotify from "../../services/api";

type Genre = "Pop" | "Rock" | "J-pop" | "Pop" | "Country" | "HipHop" | "EDM"; // Add other genres as needed.

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"],
})
export class PlayComponent implements OnInit {
  track: any;
  choices = 1;
  options: string[] = [];
  correctArtist: string = "";
  genre: string = "";
  token: string = "";
  audio: HTMLAudioElement | null = null;
  volume: number = 0.5;
  selectedAnswer: string | null = null;
  routerSubscription: Subscription | null = null;
  points: number = 0;
  roundCounter: number = 1;
  currentTime: number = 0;
  duration: number = 0;
  difficulty: string = "";
  artistList: { [key: string]: string[] } = {
    Pop: [
      "Taylor Swift",
      "Justin Bieber",
      "Ariana Grande",
      "Katy Perry",
      "Bruno Mars",
      "Ed Sheeran",
      "Shawn Mendes",
      "Selena Gomez",
      "Dua Lipa",
      "Billie Eilish",
      "Lady Gaga",
      "The Weeknd",
      "Adele",
      "Charlie Puth",
      "Halsey",
      "Camila Cabello",
      "Beyoncé",
      "Rihanna",
      "Sam Smith",
      "Maroon 5",
      "Harry Styles",
      "Olivia Rodrigo",
      "Ellie Goulding",
      "Shakira",
      "Miley Cyrus",
      "Demi Lovato",
      "Sia",
      "Nicki Minaj",
      "Post Malone",
      "Lizzo",
      "Alicia Keys",
      "Lana Del Rey",
      "Jason Derulo",
      "Meghan Trainor",
      "John Legend",
      "Niall Horan",
      "Jonas Brothers",
      "Lil Nas X",
      "Khalid",
      "P!nk",
      "Zayn",
      "Carly Rae Jepsen",
      "Tove Lo",
      "Ava Max",
      "Tinashe",
      "Bebe Rexha",
      "Julia Michaels",
      "Troye Sivan",
      "Doja Cat",
      "Rita Ora",
    ],
    Country: [
      "Blake Shelton",
      "Luke Bryan",
      "Carrie Underwood",
      "Miranda Lambert",
      "Keith Urban",
      "Dolly Parton",
      "Tim McGraw",
      "Shania Twain",
      "Kenny Chesney",
      "Garth Brooks",
      "Chris Stapleton",
      "Kacey Musgraves",
      "Zac Brown Band",
      "Lady A",
      "Florida Georgia Line",
      "Reba McEntire",
      "Jason Aldean",
      "Brad Paisley",
      "Dierks Bentley",
      "Sam Hunt",
      "Morgan Wallen",
      "Luke Combs",
      "George Strait",
      "Alan Jackson",
      "Eric Church",
      "Martina McBride",
      "Trisha Yearwood",
      "Rascal Flatts",
      "Thomas Rhett",
      "Maren Morris",
      "Little Big Town",
      "Scotty McCreery",
      "Vince Gill",
      "LeAnn Rimes",
      "Hank Williams Jr.",
      "Brantley Gilbert",
      "Billy Ray Cyrus",
      "Brooks & Dunn",
      "Clint Black",
      "Kane Brown",
      "Dustin Lynch",
      "Brett Eldredge",
      "Kelsea Ballerini",
      "Jimmie Allen",
      "Cody Johnson",
      "Trace Adkins",
      "Tyler Childers",
      "Patsy Cline",
      "Lauren Alaina",
      "Dan + Shay",
    ],
    HipHop: [
      "Kendrick Lamar",
      "Drake",
      "J. Cole",
      "Nicki Minaj",
      "Travis Scott",
      "Cardi B",
      "Lil Wayne",
      "Kanye West",
      "Jay-Z",
      "Megan Thee Stallion",
      "Future",
      "Post Malone",
      "Lil Baby",
      "21 Savage",
      "A$AP Rocky",
      "Childish Gambino",
      "Doja Cat",
      "Nas",
      "Eminem",
      "Juice WRLD",
      "Lil Uzi Vert",
      "DaBaby",
      "Young Thug",
      "Tyler, The Creator",
      "Roddy Ricch",
      "Offset",
      "Quavo",
      "Migos",
      "Big Sean",
      "Tory Lanez",
      "Lil Durk",
      "Playboi Carti",
      "YG",
      "2 Chainz",
      "Snoop Dogg",
      "Run The Jewels",
      "Polo G",
      "Pop Smoke",
      "Machine Gun Kelly",
      "Lil Yachty",
      "Logic",
      "Chance the Rapper",
      "Gucci Mane",
      "Rakim",
      "Rick Ross",
      "Fetty Wap",
      "Pusha T",
      "Wiz Khalifa",
      "Mac Miller",
      "Trippie Redd",
    ],
    EDM: [
      "Calvin Harris",
      "David Guetta",
      "Marshmello",
      "Zedd",
      "The Chainsmokers",
      "Diplo",
      "Kygo",
      "Martin Garrix",
      "Skrillex",
      "Deadmau5",
      "Steve Aoki",
      "Avicii",
      "Alan Walker",
      "DJ Snake",
      "Tiesto",
      "Armin van Buuren",
      "Oliver Heldens",
      "Hardwell",
      "Above & Beyond",
      "Kaskade",
      "Afrojack",
      "Alesso",
      "Bassnectar",
      "Dillon Francis",
      "Madeon",
      "Porter Robinson",
      "Nero",
      "Seven Lions",
      "Illenium",
      "Excision",
      "RL Grime",
      "Flume",
      "Paul van Dyk",
      "Dash Berlin",
      "Eric Prydz",
      "Don Diablo",
      "Nicky Romero",
      "Duke Dumont",
      "Deorro",
      "Louis The Child",
      "Benny Benassi",
      "Tchami",
      "Shiba San",
      "Malaa",
      "Rezz",
      "Gryffin",
      "Robin Schulz",
      "Yellow Claw",
      "Matoma",
      "NGHTMRE",
    ],
    Rock: [
      "Linkin Park",
      "Deftones",
      "Green Day",
      "Red Hot Chili Peppers",
      "Metallica",
      "Radiohead",
      "System Of A Down",
      "Nickelback",
      "Paramore",
      "Slipknot",
      "Gorillaz",
      "Cage The Elephant",
      "My Chemical Romance",
      "Three Days Grace",
      "Bring Me The Horizon",
      "Led Zeppelin",
      "AC/DC",
      "Foo Fighters",
      "Muse",
      "Alice in Chains",
      "Rage Against the Machine",
      "Nirvana",
      "The Rolling Stones",
      "Pearl Jam",
      "The Smashing Pumpkins",
      "Arctic Monkeys",
      "The Killers",
      "Oasis",
      "The Strokes",
      "Kings of Leon",
      "The Black Keys",
      "Soundgarden",
      "The Who",
      "The White Stripes",
      "Guns N' Roses",
      "The Doors",
      "Creedence Clearwater Revival",
      "Lynyrd Skynyrd",
      "Boston",
      "Scorpions",
      "Bon Jovi",
      "Eagles",
      "The Clash",
      "U2",
      "The Offspring",
      "Weezer",
      "Journey",
      "Blink-182",
      "Bad Religion",
      "Fleetwood Mac",
    ],
    ["J-pop"]: [
      "Aimer",
      "amazarashi",
      "Ariabl'eyeS",
      "BUMP OF CHICKEN",
      "ClariS",
      "Creepy Nuts",
      "DECO*27",
      "Dongdang",
      "EGOIST",
      "Fear, and Loathing in Las Vegas",
      "fripSide",
      "GALNERYUS",
      "GARNiDELiA",
      "Gen Hoshino",
      "Goose house",
      "HIMEHINA",
      "Hikaru Utada",
      "Hoshimachi Suisei",
      "iroha(sasaki)",
      "Itou Kanako",
      "Iyowa",
      "Kalafina",
      "Kanaria",
      "Kenshi Yonezu",
      "Kikuo",
      "King Gnu",
      "Linked Horizon",
      "MAISONdes",
      "MAN WITH A MISSION",
      "Masatoshi Ono",
      "mikanzil",
      "Midnight Grand Orchestra",
      "MYTH & ROID",
      "natori",
      "NEEDY GIRL OVERDOSE",
      "OxT",
      "PSYQUI",
      "RADWIMPS",
      "Reol",
      "Ryokuoushoku Shakai",
      "sasakure.UK",
      "Sangatsu no Phantasia",
      "supercell",
      "sumika",
      "takayan",
      "THE ORAL CIGARETTES",
      "TK from Ling tosite sigure",
      "TOOBOE",
      "TrySail",
      "Unlucky Morpheus",
      "UNISON SQUARE GARDEN",
      "VK Blanka",
      "WagakkiBand",
      "wotaku",
      "yanaginagi",
      "Yoshida Yasei",
      "Yunosuke",
      "YOASOBI",
      "μ's",
    ],
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const state = history.state as {
        choices: number;
        genre: Genre;
        token: string;
      };
      if (state && state.choices) {
        console.log("Play component received state:", state);
        this.choices = state.choices;
        this.genre = state.genre;
        this.token = state.token;
        this.fetchFirstTrack();
      } else {
        console.log("No state found, redirecting to home");
        this.router.navigate(["/"]);
      }
    });
    const storedVolume = localStorage.getItem('volume')
    this.volume = storedVolume ? parseFloat(storedVolume) : 0.5
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.audio) {
          this.audio.pause();
        }
      }
    });
  }
  fetchFirstTrack(attempts = 1) {
    const maxAttempts = 5;
    const artists = this.artistList[this.genre as string];
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const endpoint = "search";
    const params = {
      q: `artist:${randomArtist}`,
      type: "track",
      limit: 10,
    };
    fetchFromSpotify({ token: this.token, endpoint, params }).then(
      (data: any) => {
        const track =
          data.tracks.items[
            Math.floor(Math.random() * data.tracks.items.length)
          ];
        // const track = data.tracks.items[0];
        if (track && track.preview_url) {
          this.setupGame(track, artists);
        } else {
          console.log(data);
          console.error("No track preview available for the selected artist.");
          if (attempts < maxAttempts) {
            console.log("Retrying...");
            this.fetchFirstTrack(attempts + 1);
          } else {
            console.log(
              "Could not get a track from spotify after 5 attempts, going back to home."
            );
            this.router.navigate(["/"]);
          }
        }
      }
    );
  }

  setupGame(track: any, artists: string[]) {
    const numOptions = this.choices;
    const correctArtist = track.artists[0].name;

    // Create wrong choices
    const wrongChoices = artists.filter((artist) => artist !== correctArtist);
    const shuffledChoices = this.shuffleArray([...wrongChoices]).slice(
      0,
      numOptions - 1
    );
    shuffledChoices.push(correctArtist);

    // Shuffle all options
    const options = this.shuffleArray(shuffledChoices);

    // Set up the game state
    this.track = track;
    this.options = options;
    this.correctArtist = correctArtist;

    console.log("Game setup complete with state:", {
      track: track,
      options: options,
      correctArtist: correctArtist,
      genre: this.genre,
      token: this.token,
    });
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
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
      this.progressBar();
    }
  }

  // the progress bar is updated based on the current time and the duration of the song
  progressBar() {
    if (this.audio) {
      this.audio.addEventListener("timeupdate", this.updateProgress.bind(this));
      this.audio.addEventListener("loadedmetadata", () => {
        this.duration = this.audio!.duration;
      });
    }
  }

  updateProgress(): void {
    if (this.audio) {
      this.currentTime = this.audio.currentTime;
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
        localStorage.setItem('volume', this.volume.toString())
        // console.log("Volume changed to:", this.volume);
      }
    }
  }

  setAnswer(option: string): void {
    if (!this.selectedAnswer) {
      this.selectedAnswer = option;
      if (this.selectedAnswer === this.correctArtist) {
        this.points += 1;
      }
    }
  }

  handleContinue(): void {
    // if the answer is correct, next round
    if (this.selectedAnswer === this.correctArtist) {
      console.log("Correct answer! Points:", this.points);
      this.roundCounter++;
      this.loadNewTrack();
    }
    // else game over
    else {
      console.log(
        "Incorrect answer. Navigating to gameover with points:",
        this.points
      );
      this.router.navigate(["gameover"], { state: { points: this.points } });
    }
  }

  loadNewTrack() {
    this.selectedAnswer = null;
    const artists = this.artistList[this.genre as string];
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const endpoint = `search`;
    const params = {
      q: `artist:${randomArtist}`,
      type: "track",
      limit: 10,
    };

    fetchFromSpotify({ token: this.token, endpoint, params })
      .then((data: any) => {
        const newTrack =
          data.tracks.items[
            Math.floor(Math.random() * data.tracks.items.length)
          ];
        // const newTrack = data.tracks.items[0];
        if (newTrack && newTrack.preview_url) {
          this.setupNewGameRound(newTrack, artists);
        } else {
          console.error(
            "No track preview available for the selected artist." +
              this.correctArtist
          );
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
    this.duration = 0;
    this.currentTime = 0;
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(this.track.preview_url);
    this.audio.volume = this.volume;
    this.progressBar();

    const numOptions = this.choices;
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

  // shuffleArray(array: any[]) {
  //   return array.sort(() => Math.random() - 0.5);
  // }
}
