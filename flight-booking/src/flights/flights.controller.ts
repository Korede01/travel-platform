import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/createFlight.dto';
import { CreateUserDto } from './dto/CreateUser.dto'; 

@Controller('flights')
export class FlightsController {
    constructor(private readonly flightsService: FlightsService) {}

    @EventPattern('user_created')
    handleUserCreated(@Payload() newUser: CreateUserDto) {
        return this.flightsService.handleUserCreated(newUser);
    }

    @EventPattern('user_updated')
    handleUserUpdated(@Payload() updatedUser: CreateUserDto) {
        return this.flightsService.handleUserUpdated(updatedUser);
    }

    @EventPattern('user_deleted')
    handleUserDeleted(@Payload() deletedUser: CreateUserDto) {
        return this.flightsService.handleUserDeleted(deletedUser);
    }

    @Post('create')
    async createFlight(@Body() createFlightDto: CreateFlightDto) {
        return this.flightsService.createFlight(createFlightDto);
    }

    @Get('search')
    async searchFlights(@Body() filters: any) {
        return this.flightsService.searchFlights(filters);
    }

    @Post('book')
    async bookFlight(@Body() bookingDetails: any) {
        return this.flightsService.bookFlight(bookingDetails.flightId, bookingDetails.userId);
    }

    @Post('cancel/:id')
    async cancelBooking(@Param('id') bookingId: string) {
        return this.flightsService.cancelBooking(bookingId);
    }

    @Post('modify/:id')
    async modifyBooking(@Param('id') bookingId: string, @Body() newDetails: any) {
        return this.flightsService.modifyBooking(bookingId, newDetails);
    }
}
