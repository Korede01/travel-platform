// src/strategies/google.strategy.ts

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';
import config from 'src/config/config';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {
        super({
            clientID: config().google.clientID,
            clientSecret: config().google.clientSecret,
            callbackURL: config().google.callbackURL,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        });
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            let user = await this.userService.findByEmail(profile.emails[0].value);
            if (!user) {
                const createUserDto: CreateUserDto = {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                };
                user = await this.userService.createUser(createUserDto);
            }

            const tokens = await this.authService.login(user);

            done(null, { user, ...tokens });
        } catch (err) {
            done(err, false);
        }
    }
}


