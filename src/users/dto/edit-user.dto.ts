import {
  IsEmail,
  Length,
  IsPhoneNumber,
  Validate,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { PasswordValidation } from '../../validation/PasswordValidation';

export class EditUserDto {
  // @ValidateIf(obj => obj.nickaname !== undefined)
  @Length(4, 16, { message: 'Логин должен быть длиной от 4 до 12 символов' })
  readonly nickname?: string;

  // @ValidateIf(obj => obj.email !== undefined)
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email?: string;

  // @ValidateIf(obj => obj.number !== undefined)
  @IsNotEmpty({ message: 'Номер телефона не может быть пустым' })
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  readonly number?: string;
}
