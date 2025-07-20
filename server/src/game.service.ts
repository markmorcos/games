import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Game } from './game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async create(name: string): Promise<Game> {
    const cards = [
      ...Array.from({ length: 10 }, (_, i) => `${i + 1}`),
      ...Array.from({ length: 10 }, (_, i) => `${i + 1}`),
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
        $addToSet: { players: playerName },
      });
    } catch {
      return;
    }
  }

  async leaveGame(id: string, playerName: string): Promise<void> {
    try {
      await this.gameModel.findByIdAndUpdate(id, {
        $pull: { players: playerName },
      });
    } catch {
      return;
    }
  }

  async startGame(id: string): Promise<void> {
    try {
      await this.gameModel.findByIdAndUpdate(id, {
        status: 'in-progress',
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
