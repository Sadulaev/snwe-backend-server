import { IsDefined } from 'class-validator';

export class LoginUserDto {
    @IsDefined({ message: "Поле не может быть пустым" })
    readonly login: string;

    @IsDefined({ message: "Поле не может быть пустым" })
    readonly password: string;
}
