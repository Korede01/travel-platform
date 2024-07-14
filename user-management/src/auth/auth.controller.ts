import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayLoadDto } from 'src/users/dto/auth.dto';
import { RefreshTokenDto } from 'src/users/dto/refresh-token.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() credentials: AuthPayLoadDto) {
        return this.authService.login(credentials)
    }
    
    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refresh(refreshTokenDto.refreshToken);
    }

    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    async handleLogin() {
        return {msg: 'Google Authentication'}
    }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    handleRedirect() {
        return {msg: 'ok'}
    }
}
