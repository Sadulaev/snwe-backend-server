import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
// import { Nutrition } from 'src/products/nutrition.model';
// import { Mixture } from 'src/products/mixture.model';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  _id?: string;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({default: [] })
  nutritions: string[];

  @Prop({default: [] })
  mixtures: string[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
