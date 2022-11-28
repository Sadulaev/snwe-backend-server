import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  _id?: string;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  rememberSession: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
