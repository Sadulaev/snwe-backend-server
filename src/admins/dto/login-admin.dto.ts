import { IsDefined } from 'class-validator';

export class LoginAdminDto {
  @IsDefined({ message: 'Поле не может быть пустым' })
  readonly login?: string;

  @IsDefined({ message: 'Поле не может быть пустым' })
  readonly password?: string;
}
