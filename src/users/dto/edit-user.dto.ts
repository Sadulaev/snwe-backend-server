import {
  IsEmail,
  Length,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';
import { PasswordValidation } from '../../validation/PasswordValidation';

export class EditUserDto {
  @Length(4, 16, { message: 'Логин должен быть длиной от 4 до 12 символов' })
  readonly nickname?: string;

  @IsEmail({}, { message: 'Некорректный email' })
  readonly email?: string;

  @IsNotEmpty({ message: 'Номер телефона не может быть пустым' })
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  readonly number?: string;
}
