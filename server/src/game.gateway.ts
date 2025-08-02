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
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(gameId);
    await this.gameService.joinGame(gameId, playerName);
    client.to(gameId).emit('game-joined', playerName);
  }

  @SubscribeMessage('leave-game')
  async handleLeaveGame(
    @MessageBody()
    { gameId, playerName }: { gameId: string; playerName: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(gameId);
    await this.gameService.leaveGame(gameId, playerName);
    client.to(gameId).emit('game-left', playerName);
  }

  @SubscribeMessage('start-game')
  async handleStartGame(
    @MessageBody() gameId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await this.gameService.startGame(gameId);
    client.to(gameId).emit('game-started');
  }

  @SubscribeMessage('flip-card')
  async handleFlipCard(
    @MessageBody()
    {
      gameId,
      card,
      index,
      match,
    }: {
      gameId: string;
      card: string;
      index: number;
      match: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    await this.gameService.flipCard(gameId, index);
    if (match) await this.gameService.matchCard(gameId, card);
    client.to(gameId).emit('card-flipped', { card, index });
  }

  @SubscribeMessage('next-turn')
  async handleNextTurn(
    @MessageBody() gameId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const currentPlayer = await this.gameService.nextTurn(gameId);
    client.to(gameId).emit('turn-changed', currentPlayer);
  }

  @SubscribeMessage('finish-game')
  async handleFinishGame(
    @MessageBody() gameId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await this.gameService.finishGame(gameId);
    client.to(gameId).emit('game-finished');
  }
}
