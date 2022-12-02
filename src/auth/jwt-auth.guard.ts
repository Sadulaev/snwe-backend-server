import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException(
          'Пользователь не авторизован',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_KEY,
      });
      req.user = user;

      if (user.banned) {
        throw new HttpException(
          'Пользователь был забанен',
          HttpStatus.FORBIDDEN,
        );
        return false;
      }
      return true;
    } catch (e) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
