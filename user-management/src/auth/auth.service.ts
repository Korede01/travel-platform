import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthPayLoadDto } from 'src/users/dto/auth.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(@InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService) {}
    
    async login(credentials: AuthPayLoadDto) {

        const { email, password } = credentials;

        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new HttpException('Invalid Credentials', 404)
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new HttpException('Invalid Credentials', 404)
        }



        const payload = { sub: user._id.toString(), email: user.email };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.userModel.findByIdAndUpdate(user._id, { refreshToken });
        return {accessToken, refreshToken, message: 'Login Successful'};
    }

    async refresh(refreshToken: string) {

        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userModel.findById(payload.sub);
            if (!user || user.refreshToken !== refreshToken) {
                throw new HttpException('Invalid token', 401);
            }

            const newPayload = { sub: user._id.toString(), email: user.email };
            const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '1h' });
            const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

            await this.userModel.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (e) {
            throw new HttpException('Invalid token', 401);
        }
    }
    

}
