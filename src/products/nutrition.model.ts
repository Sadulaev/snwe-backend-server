import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from './category.model';

export type NutritionDocument = HydratedDocument<Nutrition>;

@Schema()
export class Nutrition {
  _id?: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  info: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop({ default: [] })
  warnings: string[];
}

export const NutritionSchema = SchemaFactory.createForClass(Nutrition);
