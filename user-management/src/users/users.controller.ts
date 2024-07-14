// src/users/users.controller.ts
import mongoose from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';
import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService,) {}

    @Post('signup')
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    getUsers(@Req() req) {
        return this.usersService.getsUsers();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getUserById(@Param('id') id: string, @Req() req) {
        if (id !== req.userId) throw new HttpException('Unauthorized Access', 403);

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('User not found', 404);

        const findUser = await this.usersService.getUserById(id);
        if (!findUser) throw new HttpException('User not found', 404);
        return findUser;
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
        if (id !== req.userId) throw new HttpException('Unauthorized Access', 403);

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const updatedUser = await this.usersService.updateUser(id, updateUserDto);
        if (!updatedUser) throw new HttpException('User Not Found', 404);
        return updatedUser;
    }


    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Req() req) {
        if (id !== req.userId) throw new HttpException('Unauthorized Access', 403);

        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 400);

        const deletedUser = await this.usersService.deleteUser(id);
        if (!deletedUser) throw new HttpException('User Not Found', 404);
        return;
    }
}
