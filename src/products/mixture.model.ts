import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MixtureDocument = HydratedDocument<Mixture>;

@Schema()
export class Mixture {
  _id?: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  info: string[];

  @Prop({ required: true })
  twoWeekPrice: number;

  @Prop({ required: true })
  twoMonthPrice: number;

  @Prop({ default: [] })
  warnings: string[];
}

export const MixtureSchema = SchemaFactory.createForClass(Mixture);
