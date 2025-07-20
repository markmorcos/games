import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import { GameService } from './game.service';

@Controller('api/memory/games')
export class AppController {
  @Inject(GameService)
  private readonly gameService: GameService;

  @Post()
  async createGame(@Body('name') name: string) {
    if (!name) {
      throw new BadRequestException();
    }

    const game = await this.gameService.create(name);
    if (!game) {
      throw new BadRequestException();
    }

    return game;
  }

  @Get(':id')
  async getGame(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException();
    }

    const game = await this.gameService.findById(id);
    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }
}
