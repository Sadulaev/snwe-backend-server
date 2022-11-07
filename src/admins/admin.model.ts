import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/user.model';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin{

    _id?: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Owner'})
    userId: User;

    @Prop({required: true, unique: true})
    nickname: string;
    
    @Prop({required: true})
    password: string;
    
    @Prop({default: 1})
    accessLvl: number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin)