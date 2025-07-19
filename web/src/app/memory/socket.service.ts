import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(`${environment.socketUrl}/memory`, {
      path: '/socket/memory/socket.io',
      transports: ['websocket'],
    });
  }

  joinGame(userId: string, gameId: string) {
    this.socket.emit('join-game', { userId, gameId });
  }

  leaveGame(userId: string, gameId: string) {
    this.socket.emit('leave-game', { userId, gameId });
  }

  flipCard(userId: string, gameId: string, cardId: string) {
    this.socket.emit('flip-card', { userId, gameId, cardId });
  }
}
