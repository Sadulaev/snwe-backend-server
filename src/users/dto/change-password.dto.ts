import { IsDefined, Validate } from 'class-validator';
import { PasswordValidation } from '../../validation/PasswordValidation';

export class ChangePasswordDto {
    @Validate(PasswordValidation)
    @IsDefined({ message: "Поле не может быть пустым" })
    readonly password: string;

    @IsDefined({message: 'Необходимо указать предыдущий пароль'})
    readonly previousPassword: string;
}
