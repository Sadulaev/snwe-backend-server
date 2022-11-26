import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  // @Prop({ default: [] })
  // favorite: string[];

  @Prop({ default: false })
  isActivated: boolean;

  @Prop({ unique: true })
  activationLink: string;

  @Prop({ default: false })
  banned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
