import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  _id?: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({required: true})
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);