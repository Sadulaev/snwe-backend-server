import { IsEmail, Length, IsPhoneNumber, Validate, IsNotEmpty, IsDefined } from "class-validator";
import { PasswordValidation } from "src/validation/PasswordValidation";

export class CreateUserDto {
    @IsDefined()
    @Length(4, 16, {message: 'Логин должен быть длиной от 4 до 12 символов'})
    readonly nickname: string;

    @IsDefined()
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;

    @IsDefined()
    @IsNotEmpty({message: 'Номер телефона не может быть пустым'})
    @IsPhoneNumber('RU', {message: 'Некорректный номер телефона'})
    readonly number: string;

    @IsDefined()
    @Validate(PasswordValidation)
    readonly password: string;
}