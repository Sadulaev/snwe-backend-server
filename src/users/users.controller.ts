import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Redirect,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UsersService } from './users.service';
import { ValidationPipe } from '../pipes/validation.pipe';
import { EditUserDto } from './dto/edit-user.dto';
import { Access } from 'src/auth/access.decorator';
import { AccessGuard } from 'src/auth/access.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/create')
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Access([0, 1])
  @UseGuards(AccessGuard)
  @Get('/getAll')
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getById')
  async findUserById(@Req() req): Promise<User> {
    return this.usersService.findUserById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/nickname')
  async editName(@Body(new ValidationPipe()) editUserDto: EditUserDto, @Req() req) {
    return this.usersService.updateUserName(req.user.id, editUserDto.nickname)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/email')
  async editEmail(@Body(new ValidationPipe()) editUserDto: EditUserDto, @Req() req) {
    return this.usersService.updateUserEmail(req.user.id, editUserDto.email)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/number')
  async editNumber(@Body(new ValidationPipe()) editUserDto: EditUserDto, @Req() req) {
    return this.usersService.updateUserNumber(req.user.id, editUserDto.number)
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/password')
  async editPassword(@Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto, @Req() req) {
    return this.usersService.updateUserPassword(req.user.id, changePasswordDto.password, changePasswordDto.previousPassword)
  }

  // @Get('/getName/:nickname')
  // async findUserByName(@Param('nickname') nickname: string): Promise<User> {
  //   return this.usersService.findUserByName(nickname);
  // }

  // @Get('/getMail/:email')
  // async findUserByEmail(@Param('email') email: string): Promise<User> {
  //   return this.usersService.findUserByEmail(email);
  // }

  // @Get('/getNumber/:number')
  // async findUserByNumber(@Param('number') number: string): Promise<User> {
  //   return this.usersService.findUserByNumber(number);
  // }
}
