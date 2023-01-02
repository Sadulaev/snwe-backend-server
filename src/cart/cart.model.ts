import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  _id?: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: string;

  @Prop({default: [] })
  nutritions: string[];

  @Prop({default: [] })
  mixtures: string[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
