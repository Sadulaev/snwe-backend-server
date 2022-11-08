import mongoose, { HydratedDocument} from "mongoose";
import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { Category } from "./category.model";

export type NutritionDocument = HydratedDocument<Nutrition>;

@Schema()
export class Nutrition {
    _id?: string;

    @Prop()
    image: string;

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    info: string;

    @Prop({required: true})
    price: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category'})
    category: Category;

    @Prop()
    warnings: string[];
}

export const NutritionSchema = SchemaFactory.createForClass(Nutrition)