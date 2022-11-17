import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { ACCESS_KEY } from 'src/auth/access.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredAccessLvl = this.reflector.getAllAndOverride<number[]>(ACCESS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredAccessLvl) {
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
            }

            try {
                const admin = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
                console.log(admin)
                req.admin = admin;
                if(!requiredAccessLvl.includes(admin.accessLvl)) throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
                return true;
            } catch (e) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
            }

        } else {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}