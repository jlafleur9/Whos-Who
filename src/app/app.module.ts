import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ButtonComponent } from "./components/button/button.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { PlayComponent } from './play/play.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "play", component: PlayComponent },
  { path: "leaderboard", component: LeaderboardComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ButtonComponent,
    LeaderboardComponent,
    PlayComponent,
  ],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
