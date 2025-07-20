import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Game } from './game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async create(name: string): Promise<Game> {
    const cards = [
      ...Array.from({ length: 2 }, (_, i) => `${i + 1}`),
      ...Array.from({ length: 2 }, (_, i) => `${i + 1}`),
    ]
      .map((value) => ({ value, flipped: false }))
      .sort(() => Math.random() - 0.5);
    const createdGame = new this.gameModel({ name, cards });
    return createdGame.save();
  }

  async findById(id: string): Promise<Game | null> {
    try {
      return await this.gameModel.findById(id);
    } catch {
      return null;
    }
  }

  async joinGame(id: string, playerName: string): Promise<void> {
    try {
      await this.gameModel.findByIdAndUpdate(id, {
        $addToSet: { players: { name: playerName, score: 0 } },
      });
    } catch {
      return;
    }
  }

  async leaveGame(id: string, playerName: string): Promise<void> {
    try {
      const game = await this.gameModel.findById(id);
      if (!game) return;
      await this.gameModel.findByIdAndUpdate(id, {
        players: game.players.filter((player) => player.name !== playerName),
      });
    } catch {
      return;
    }
  }

  async startGame(id: string): Promise<void> {
    try {
      const game = await this.gameModel.findById(id);
      if (!game) return;
      await this.gameModel.findByIdAndUpdate(id, {
        status: 'in-progress',
        currentPlayer: game.players[0].name,
      });
    } catch {
      return;
    }
  }

  async flipCard(id: string, index: number): Promise<void> {
    const game = await this.gameModel.findById(id);
    if (!game || !game.cards?.[index]) return;

    game.cards[index].flipped = !game.cards[index].flipped;
    await game.save();
  }

  async matchCard(id: string, card: string): Promise<void> {
    try {
      await this.gameModel.findByIdAndUpdate(id, {
        $addToSet: { matchedCards: card },
      });
    } catch {
      return;
    }
  }

  async nextTurn(id: string): Promise<void> {
    try {
      const game = await this.gameModel.findById(id);
      if (!game) return;

      const currentIndex = game.players.findIndex(
        (player) => player.name === game.currentPlayer,
      );
      const nextIndex = (currentIndex + 1) % game.players.length;

      await this.gameModel.findByIdAndUpdate(id, {
        currentPlayer: game.players[nextIndex].name,
      });
    } catch {
      return;
    }
  }

  async finishGame(id: string): Promise<void> {
    try {
      await this.gameModel.findByIdAndUpdate(id, {
        status: 'finished',
      });
    } catch {
      return;
    }
  }
}
