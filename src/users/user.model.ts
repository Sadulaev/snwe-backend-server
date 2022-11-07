import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from "mongoose"

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    nickname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    number: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: [] })
    shopHistry: string[];

    
    @Prop({ default: [] })
    favorite: string[];
    
    @Prop({ default: false })
    banned: boolean;

    // @Prop({ default: 'USER' })
    // role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);