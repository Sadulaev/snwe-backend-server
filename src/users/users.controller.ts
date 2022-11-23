import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UsersService } from './users.service';
import { ValidationPipe } from '../pipes/validation.pipe';
import { EditUserDto } from './dto/edit-user.dto';
import { Access } from 'src/auth/access.decorator';
import { AccessGuard } from 'src/auth/access.guard';

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
  async removeUserById(@Param('id') id: string) {
    return this.usersService.removeUserById(id);
  }
  @Access([0])
  @UseGuards(AccessGuard)
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
  ) {
    return this.usersService.updateUserById(id, editUserDto);
  }

  @Get('/checkName')
  async isUniqueName(@Param('name') name: string) {
    return this.usersService.isUniqueName(name)
  }
  @Get('/checkEmail')
  async isUniqueEmail(@Param('email') email: string) {
    return this.usersService.isUniqueEmail(email)
  }
    @Get('/checkName')
  async isUniqueNumber(@Param('number') number: string) {
    return this.usersService.isUniqueNumber(number)
  }

  @Get('/mail/confirm/:link')
  async confirmAccount(@Param('link') link: string) {
    return this.usersService.activateUser(link)
  }
}
