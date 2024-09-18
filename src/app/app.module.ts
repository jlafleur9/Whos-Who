import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ButtonComponent } from "./components/button/button.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { PlayComponent } from './play/play.component';
import { GameoverComponent } from './gameover/gameover.component';
import { TextinputComponent } from './gameover/textinput/textinput.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "play", component: PlayComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "gameover", component: GameoverComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ButtonComponent,
    LeaderboardComponent,
    PlayComponent,
    GameoverComponent,
    TextinputComponent,
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), ReactiveFormsModule],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
