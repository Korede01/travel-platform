import { IsString, IsDate, IsNumber } from 'class-validator';

export class CreateFlightDto {
    @IsString()
    readonly flightNumber: string;

    @IsString()
    readonly airline: string;

    @IsDate()
    readonly departure: Date;

    @IsDate()
    readonly arrival: Date;

    @IsString()
    readonly from: string;

    @IsString()
    readonly to: string;

    @IsNumber()
    readonly price: number;
}
