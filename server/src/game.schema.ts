import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Game extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: [] })
  players: string[];

  @Prop()
  cards: string[];

  @Prop({ default: 'waiting', enum: ['waiting', 'in-progress', 'finished'] })
  status: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
