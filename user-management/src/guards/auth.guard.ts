// src/guards/auth.guard.ts
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, HttpException, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

    private revokedTokens: Set<string> = new Set();

    constructor(private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token || this.revokedTokens.has(token)) {
            throw new HttpException('Unauthorized Access', 401);
        }

        try {
            const payload = this.jwtService.verify(token);
            request.userId = payload.sub; 
        } catch (e) {
            Logger.error(e.message);
            throw new HttpException('Unauthorized Access', 401);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    revokeToken(token: string) {
        this.revokedTokens.add(token)
    }
}
