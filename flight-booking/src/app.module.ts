import { Module } from '@nestjs/common';
import { FlightsModule } from './flights/flights.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({
      secret: config().jwt.secret,
      global: true,
    }),
    FlightsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
