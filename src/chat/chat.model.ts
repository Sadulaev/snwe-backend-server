import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type ChatDocument = HydratedDocument<Chat>;

export interface UserType {
    id: mongoose.Schema.Types.ObjectId;
    name: string;
}

export interface AdminType {
    id: mongoose.Schema.Types.ObjectId;
    name: string;
}

export interface ChatType {
    message: string;
    from: 'user' | 'admin';
    timestamp: Date;
}

@Schema()
export class Chat {
    _id?: mongoose.Schema.Types.ObjectId;

    @Prop({type: Object, ref: 'User', required: true })
    user: UserType;

    @Prop({type: Object, ref: 'Admin'})
    admin?: AdminType;

    @Prop({type: Array, default: []})
    messages: Array<ChatType>

    @Prop({type: Date, default: new Date()})
    createdAt?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat)