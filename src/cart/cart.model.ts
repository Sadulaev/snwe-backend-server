import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  _id?: string;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  products: string[];

  @Prop()
  price: number;

  @Prop()
  discountSum: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
