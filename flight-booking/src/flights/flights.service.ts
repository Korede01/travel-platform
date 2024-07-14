import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Flight } from './schemas/flights.schema';
import { Booking } from './schemas/booking.schema';
import { CreateUserDto } from '../flights/dto/CreateUser.dto'; // Update path if necessary
import { CreateFlightDto } from './dto/createFlight.dto';

@Injectable()
export class FlightsService {
    private readonly logger = new Logger(FlightsService.name);

    constructor(
        @InjectModel(Flight.name) private flightModel: Model<Flight>,
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    ) {}

    handleUserCreated(newUser: CreateUserDto) {
        this.logger.log(`Received new user: ${newUser.email}`);
        // Implement logic to handle new user creation in flights service
    }

    handleUserUpdated(updatedUser: CreateUserDto) {
        this.logger.log(`Received updated user: ${updatedUser.email}`);
        // Implement logic to handle user updates in flights service
    }

    handleUserDeleted(deletedUser: CreateUserDto) {
        this.logger.log(`Received deleted user: ${deletedUser.email}`);
        // Implement logic to handle user deletion in flights service
    }

    async createFlight(createFlightDto: CreateFlightDto): Promise<Flight> {
        const newFlight = new this.flightModel(createFlightDto);
        return newFlight.save();
    }

    async searchFlights(filters: any): Promise<Flight[]> {
        return this.flightModel.find(filters).exec();
    }

    async bookFlight(flightId: string, userId: string): Promise<Booking> {
        const booking = new this.bookingModel({ flightId, userId, bookingDate: new Date(), status: 'booked', paymentStatus: 'pending' });
        return booking.save();
    }

    async cancelBooking(bookingId: string): Promise<Booking> {
        return this.bookingModel.findByIdAndUpdate(bookingId, { status: 'cancelled' }, { new: true }).exec();
    }

    async modifyBooking(bookingId: string, newDetails: any): Promise<Booking> {
        return this.bookingModel.findByIdAndUpdate(bookingId, newDetails, { new: true }).exec();
    }
}
