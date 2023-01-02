import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
    id?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({type: Object,required: true})
    userInfo: Object;

    @Prop({type: Boolean, required: true })
    isDelivery: string;

    @Prop({type: Object, required: true, default: null })
    userAddress: Object | null

    @Prop({type: Object, ref: 'Nutrition', default: [] })
    nutritions: Object;

    @Prop({type: Object, ref: 'Mixture', default: [] })
    mixtures: Object;

    @Prop({ default: [] })
    trainPlans: string[];

    @Prop({ required: true })
    total: number;

    @Prop({ default: new Date() })
    openDate: Date;

    @Prop()
    closeDate: Date;

    @Prop({type: String, default: 'PENDING', enum: ['PENDING', 'INPROGRESS', 'INTHEWAY', 'WAITING', 'ACCEPTING', 'COMPLETED', 'FAILED']})
    status: string;

    @Prop({type: Boolean, default: false })
    isClosed: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order)