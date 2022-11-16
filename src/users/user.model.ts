import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id?: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop()
  email: string = null;

  @Prop({ required: true, unique: true })
  number: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  shopHistry: string[];

  @Prop({ default: [] })
  favorite: string[];

  @Prop({ default: false })
  banned: boolean;

  // @Prop({ default: 'USER' })
  // role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
