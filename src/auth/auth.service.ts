import { Injectable } from '@nestjs/common';
import { Admin } from 'src/admins/admin.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt/dist';
import * as bcrypt from 'bcryptjs'
import { HttpException, HttpStatus } from '@nestjs/common';
import { DuplicationException } from 'src/exceptions/validation.exception';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async userRegist(userDto: CreateUserDto) {
        const newUser = await this.checkDuplicate(userDto)
        const hashPassword = await bcrypt.hash(userDto.password, +(process.env.BCRYPT_HASH))
        const createdUser = this.usersService.createUser({ ...newUser, password: hashPassword })
        if (createdUser) {
            throw new HttpException('Регистрация прошла успешно', HttpStatus.CREATED)
        }
        throw new HttpException('Ошибка регистрации', HttpStatus.BAD_REQUEST)
    }

    async userLogin(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto)
        return this.generateToken(user)
    }

    private async generateToken(user: User | Admin) {
        const payload = { id: user._id, nickname: user.nickname }
        return {
            token: this.jwtService.sign(payload, {secret: process.env.JWT_SECRET_KEY})
        }
    }

    private async validateUser(loginUserDto: LoginUserDto) {
        const email = await this.usersService.findUserByEmail(loginUserDto.login);
        const nickname = await this.usersService.findUserByName(loginUserDto.login);
        const user = email || nickname;

        if (user) {
            const checkPassword = bcrypt.compare(loginUserDto.password, user.password)

            if (checkPassword) {
                return user
            }
            throw new HttpException('Некорректный логин или пароль', HttpStatus.BAD_REQUEST)
        }
    }

    private async checkDuplicate(userDto: CreateUserDto) {
        let errors = {
            email: '', nickname: '', number: ''
        }
        const email = await this.usersService.findUserByEmail(userDto.email)
        const nickname = await this.usersService.findUserByName(userDto.nickname)
        const number = await this.usersService.findUserByNumber(userDto.number)

        email ? errors.email = 'Пользователь с такими адресом почтового ящика уже зарегистрирован' : false
        nickname ? errors.nickname = 'Данный логин используется другим пользователем' : false
        number ? errors.number = 'Пользователь с таким номером уже зарегистрирован' : false

        if(email || nickname || number) {
            throw new DuplicationException(errors)
        }
        return userDto;
    }

}
 