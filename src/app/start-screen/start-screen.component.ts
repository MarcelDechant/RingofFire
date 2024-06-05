import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { collection, addDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {}

  async newGame() {
    try {
      const gameRef = await addDoc(collection(this.firestore, 'games'), {});
      const gameId = gameRef.id;
      this.router.navigateByUrl(`/game/${gameId}`);
    } catch (error) {
      console.error('Fehler beim Erstellen des Spiels:', error);
    }
  }
}