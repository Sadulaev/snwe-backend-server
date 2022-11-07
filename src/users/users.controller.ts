import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UsersService } from './users.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { EditUserDto } from './dto/edit-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/create')
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('/remove/:id')
  async removeUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUserById(id);
  }

  @Delete('/removeAll')
  async removeAllUsers(): Promise<User[]> {
    return this.usersService.removeAllUsers();
  }

  @Get('/getAll')
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/getId/:id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Get('/getName/:nickname')
  async findUserByName(@Param('nickname') nickname: string): Promise<User> {
    return this.usersService.findUserByName(nickname);
  }

  @Get('/getMail/:email')
  async findUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findUserByEmail(email);
  }

  @Get('/getNumber/:number')
  async findUserByNumber(@Param('number') number: string): Promise<User> {
    return this.usersService.findUserByNumber(number);
  }

  @Put('/updateId/:id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) editUserDto: EditUserDto,
  ): Promise<User> {
    return this.usersService.updateUserById(id, editUserDto);
  }
}
