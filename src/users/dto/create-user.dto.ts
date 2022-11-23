import {
  IsEmail,
  Length,
  IsPhoneNumber,
  Validate,
  IsNotEmpty,
  IsDefined,
  IsUUID,
} from 'class-validator';
import { PasswordValidation } from '../../validation/PasswordValidation';

export class CreateUserDto {
  @IsDefined({message: "Поле не может быть пустым"})
  @Length(4, 16, { message: 'Логин должен быть длиной от 4 до 12 символов' })
  readonly nickname: string;

  // @IsDefined({message: "Поле не может быть пустым"})
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @IsDefined({message: "Поле не может быть пустым"})
  @IsNotEmpty({ message: 'Номер телефона не может быть пустым' })
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  readonly number: string;

  @IsDefined({message: "Поле не может быть пустым"})
  @Validate(PasswordValidation)
  readonly password: string;

  @IsUUID(4,{message: 'Ошибка создания ссылки активации почты'})  
  readonly activationLink: string;
}
