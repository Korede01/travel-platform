import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'src/config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Flight, FlightSchema } from './schemas/flights.schema';
import { FlightsController } from './flights.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config], // Load the configuration
    }),
    MongooseModule.forFeature([
      { name: Flight.name, schema: FlightSchema },
      { name: Booking.name, schema: BookingSchema }
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FlightsService],
  controllers: [FlightsController],
  exports: [FlightsService, MongooseModule]
})

export class FlightsModule {}
