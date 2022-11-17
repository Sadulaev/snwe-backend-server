import { Injectable } from '@nestjs/common';
import { Admin } from 'src/admins/admin.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcryptjs'
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AdminsService } from 'src/admins/admins.service';
import { LoginAdminDto } from 'src/admins/dto/login-admin.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private adminsService: AdminsService, private jwtService: JwtService) { }

    async userRegist(userDto: CreateUserDto) {
        const hashPassword = await bcrypt.hash(userDto.password, +(process.env.BCRYPT_HASH))
        return await this.usersService.createUser({ ...userDto, password: hashPassword })
    }

    async userLogin(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto)
        return this.generateUserToken(user)
    }

    async adminLogin(loginAdminDto: LoginAdminDto) {
        const admin = await this.validateAdmin(loginAdminDto)
        return this.generateAdminToken(admin)
    }


    private async generateUserToken(user: User) {
        const payload = { id: user._id, nickname: user.nickname, number: user.number }
        return {
            token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY })
        }
    }

    private async generateAdminToken(admin: Admin) {
        const payload = { id: admin._id, nickname: admin.nickname, accessLvl: admin.accessLvl }
        return {
            token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET_KEY })
        }
    }

    private async validateUser(loginUserDto: LoginUserDto) {
        const email = await this.usersService.findUserByEmail(loginUserDto.login);
        const nickname = await this.usersService.findUserByName(loginUserDto.login);
        const user = email || nickname;
        if (user) {
            console.log(user)
            const checkPassword = await bcrypt.compare(loginUserDto.password, user.password)

            if (checkPassword) {
                return user
            }
            throw new HttpException('Неверный логин или пароль', HttpStatus.BAD_REQUEST)
        } else {
            throw new HttpException('Неверный логин или пароль', HttpStatus.BAD_REQUEST)
        }
    }

    private async validateAdmin(loginAdminDto: LoginAdminDto) {
        const admin = await this.adminsService.getAdminByName(loginAdminDto.nickname)
        if (admin.nickname) {
            const checkPassword = await bcrypt.compare(loginAdminDto.password, admin.password)
            if (checkPassword) {
                return admin;
            }
            throw new HttpException('Неверный логин или пароль', HttpStatus.BAD_REQUEST)
        } else {
            throw new HttpException('Неверный логин или пароль', HttpStatus.BAD_REQUEST)
        }
    }

}
