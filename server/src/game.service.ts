import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Game } from './game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async create(name: string): Promise<Game> {
    const createdGame = new this.gameModel({ name });
    return createdGame.save();
  }

  async findById(id: string): Promise<Game | null> {
    try {
      return await this.gameModel.findById(id);
    } catch {
      return null;
    }
  }
}
