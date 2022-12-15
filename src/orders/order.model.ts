import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
    id?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Nutrition'}], default: []})
    nutritions: string[];

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mixture'}], default: []})
    mixtures: string[];

    @Prop()
    trainPlans: string[]

    @Prop({required: true})
    price: number;

    @Prop({required: true})
    isDelivery: string;

    @Prop({required: true, default: null})
    address: string | null

    @Prop({default: new Date()})
    openDate: Date;

    @Prop()
    closeDate: Date;

    @Prop({default: 'Ожидание оплаты'})
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order)