import { IsOptional } from 'class-validator';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class User {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, IsOptional: true})
    password: string;

    @Prop()
    address: string;

    @Prop()
    phone: string;

    @Prop()
    refreshToken: string;

}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};