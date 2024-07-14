import { IsDate, IsNumber, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Flight {

    @Prop({ required: true })
    @IsString()
    flightNumber: string;

    @Prop({ required: true })
    @IsString()
    airline: string;

    @Prop({ required: true })
    @IsDate()
    departure: Date;

    @Prop({ required: true })
    @IsDate()
    arrival: Date;

    @Prop({ required: true })
    @IsString()
    from: string;

    @Prop({ required: true })
    @IsString()
    to: string;

    @Prop({ required: true })
    @IsNumber()
    price: number;

}

export const FlightSchema = SchemaFactory.createForClass(Flight);




