import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GameService } from '../game.service';
import { SocketService } from '../socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private gameService = inject(GameService);
  private socketService = inject(SocketService);

  game = this.gameService.game;
  loading = this.gameService.loading;
  gameId = this.route.snapshot.paramMap.get('id');

  playerName = localStorage.getItem('playerName') || '';
  joined = computed(
    () =>
      (!this.loading() &&
        this.game()?.players.some(
          (player) => player.name === this.playerName
        )) ||
      false
  );
  waiting = computed(() => this.game()?.status === 'waiting');
  started = computed(() => this.game()?.status === 'in-progress');
  canFinish = computed(
    () =>
      this.finished() ||
      this.game()!.cards.length === this.game()!.matchedCards.length * 2
  );
  finished = computed(() => this.game()?.status === 'finished');

  ngOnInit() {
    const subscription = this.gameService.getGame(this.gameId!).subscribe({
      complete: () => {
        if (!this.gameId) return;

        if (localStorage.getItem('playerName') && this.waiting()) {
          this.joinGame();
        }

        if (this.canFinish()) {
          this.endGame();
        }
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
    // window.onbeforeunload = () => this.ngOnDestroy();

    this.socketService.viewGame(this.gameId!);

    this.socketService.socket.on('game-joined', (playerName) => {
      this.gameService.addPlayer(playerName);
    });

    this.socketService.socket.on('game-left', (playerName) => {
      this.gameService.removePlayer(playerName);
    });

    this.socketService.socket.on('game-started', () => {
      this.gameService.startGame();
    });

    this.socketService.socket.on('card-flipped', ({ index }) => {
      this.gameService.flipCard(index);

      if (this.canFinish()) {
        this.endGame();
      }
    });

    this.socketService.socket.on('turn-changed', (playerName: string) => {
      this.gameService.setTurn(playerName);
    });

    this.socketService.socket.on('game-finished', () => {
      this.gameService.finishGame();
    });
  }

  // ngOnDestroy() {
  //   this.socketService.leaveGame(this.gameId!, this.playerName);
  //   this.gameService.removePlayer(this.playerName);
  // }

  joinGame() {
    localStorage.setItem('playerName', this.playerName);
    this.socketService.joinGame(this.gameId!, this.playerName);
    this.gameService.addPlayer(this.playerName);
  }

  startGame() {
    this.socketService.startGame(this.gameId!);
    this.gameService.startGame();
  }

  flipCard(index: number) {
    const card = this.game()!.cards[index];
    if (
      !card ||
      card.flipped ||
      this.game()!.currentPlayer !== this.playerName ||
      this.game()!.matchedCards.includes(card.value) ||
      this.game()!.cards.filter(
        (c, i) =>
          i !== index &&
          c.flipped &&
          !this.game()!.matchedCards.includes(c.value)
      ).length === 2
    )
      return;

    const match = !!this.game()!.cards.find(
      (c, i) => c.value === card.value && i !== index && c.flipped
    );

    this.socketService.flipCard({
      gameId: this.gameId!,
      playerName: this.playerName,
      card: card.value,
      index,
      match,
    });
    this.gameService.flipCard(index);

    if (match) {
      this.gameService.matchCard(card.value);
    } else {
      const otherIndex = this.game()!.cards.findIndex(
        (c, i) =>
          i !== index &&
          c.flipped &&
          !this.game()!.matchedCards.includes(c.value)
      );

      if (otherIndex !== -1) {
        setTimeout(() => {
          this.socketService.nextTurn(this.gameId!);
          this.gameService.nextTurn(this.playerName);

          this.socketService.flipCard({
            gameId: this.gameId!,
            playerName: this.playerName,
            card: card.value,
            index,
            match: false,
          });
          this.gameService.flipCard(index);

          this.socketService.flipCard({
            gameId: this.gameId!,
            playerName: this.playerName,
            card: this.game()!.cards[otherIndex].value,
            index: otherIndex!,
            match: false,
          });
          this.gameService.flipCard(otherIndex);
        }, 1000);
      }
    }

    if (this.canFinish()) {
      this.endGame();
    }
  }

  endGame() {
    setTimeout(() => {
      this.socketService.finishGame(this.gameId!);
      this.gameService.finishGame();
    }, 2000);
  }
}
