import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { GameService } from './game.service';

@WebSocketGateway(3001, { namespace: '/socket/memory', cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  @Inject(GameService)
  private readonly gameService: GameService;

  @SubscribeMessage('view-game')
  handleViewGame(
    @MessageBody() gameId: string,
    @ConnectedSocket() client: Socket,
  ) {
    return client.join(gameId);
  }

  @SubscribeMessage('join-game')
  async handleJoinGame(
    @MessageBody()
    { gameId, playerName }: { gameId: string; playerName: string },
  ) {
    await this.gameService.joinGame(gameId, playerName);
    this.server.to(gameId).emit('game-joined', playerName);
  }

  @SubscribeMessage('leave-game')
  async handleLeaveGame(
    @MessageBody()
    { gameId, playerName }: { gameId: string; playerName: string },
  ) {
    await this.gameService.leaveGame(gameId, playerName);
    this.server.to(gameId).emit('game-left', playerName);
  }

  @SubscribeMessage('start-game')
  async handleStartGame(@MessageBody() gameId: string) {
    await this.gameService.startGame(gameId);
    this.server.to(gameId).emit('game-started');
  }

  @SubscribeMessage('flip-card')
  async handleFlipCard(
    @MessageBody()
    {
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
    },
  ) {
    await this.gameService.flipCard(gameId, index);
    if (match) await this.gameService.matchCard(gameId, card);
    this.server.to(gameId).emit('card-flipped', { playerName, card, index });
  }

  @SubscribeMessage('finish-game')
  async handleFinishGame(@MessageBody() gameId: string) {
    await this.gameService.finishGame(gameId);
    this.server.to(gameId).emit('game-finished');
  }
}
