import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { collection, onSnapshot, Firestore, addDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatIconModule, MatButtonModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnimation = false;
  currentCard: string = '';
  game: Game;

  firestore: Firestore = inject(Firestore);
  currentGameId: string = '';
  games: Game[] = [];
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.game = new Game();
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.currentGameId = params["id"];
      if (this.currentGameId) {
        await this.loadExistingGame(this.currentGameId);
      } 
    });
  }

  private async loadExistingGame(gameId: string) {
    const gameDocRef = doc(this.firestore, `games/${gameId}`);
    const gameDocSnap = await getDoc(gameDocRef);

    if (gameDocSnap.exists()) {
      const gameData = gameDocSnap.data() as Game;
      this.game = Object.assign(new Game(), gameData);
      this.subscribeToGameUpdates(gameId);
    } 
  }

  private subscribeToGameUpdates(gameId: string) {
    const gameDocRef = doc(this.firestore, `games/${gameId}`);
    onSnapshot(gameDocRef, snapshot => {
      if (snapshot.exists()) {
        const gameData = snapshot.data() as Game;
        this.game = Object.assign(new Game(), gameData);
        
      }
    });
  }


  private async updateGame() {
    if (this.currentGameId) {
      const gameDocRef = doc(this.firestore, `games/${this.currentGameId}`);
      await setDoc(gameDocRef, this.game.toJson());
    }
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() ?? 'default_card';
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.updateGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(async (name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        await this.updateGame();

      }
    });
  }
}