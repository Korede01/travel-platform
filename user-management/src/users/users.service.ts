import { Injectable, HttpException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @Inject('USER_SERVICE') private readonly client: ClientProxy,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password } = createUserDto;

        const emailInUse = await this.userModel.findOne({ email });
        if (emailInUse) {
            throw new HttpException('Email already exists', 404);
        }

        let hashedPassword = '';
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        
        await newUser.save();
        this.client.emit('user_created', newUser);
        
        return newUser;
    }

    getsUsers() {
        return this.userModel.find();
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
        if (updatedUser) {
            this.client.emit('user_updated', updatedUser);
        }
        
        return updatedUser;
    }

    async deleteUser(id: string): Promise<User | null> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (deletedUser) {
            this.client.emit('user_deleted', deletedUser);
        }
        
        return deletedUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }
}
