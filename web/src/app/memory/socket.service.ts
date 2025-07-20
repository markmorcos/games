import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io(`${environment.socketUrl}/memory`, {
      transports: ['websocket'],
    });
  }

  viewGame(gameId: string) {
    this.socket.emit('view-game', gameId);
  }

  joinGame(gameId: string, playerName: string) {
    this.socket.emit('join-game', { gameId, playerName });
  }

  leaveGame(gameId: string, playerName: string) {
    this.socket.emit('leave-game', { gameId, playerName });
  }

  startGame(gameId: string) {
    this.socket.emit('start-game', gameId);
  }

  flipCard({
    gameId,
    playerName,
    card,
    index,
    match,
  }: {
    gameId: string;
    playerName: string;
    card: string;
    index: number;
    match: boolean;
  }) {
    this.socket.emit('flip-card', { gameId, playerName, card, index, match });
  }

  finishGame(gameId: string) {
    this.socket.emit('finish-game', gameId);
  }
}
