import { IsDate, IsNumber, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Booking {

    @Prop({ required: true })
    @IsString()
    userId: string;

    @Prop({ required: true })
    @IsString()
    flightId: string;

    @Prop({ required: true })
    @IsDate()
    bookingDate: Date;

    @Prop({ required: true })
    @IsString()
    status: string;

    @Prop({ required: true })
    @IsString()
    paymentStatus: string;

}

export const BookingSchema = SchemaFactory.createForClass(Booking);




