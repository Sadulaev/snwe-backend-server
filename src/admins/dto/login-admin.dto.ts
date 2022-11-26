import { IsDefined } from 'class-validator';

export class LoginAdminDto {
  @IsDefined({ message: 'Поле не может быть пустым' })
  readonly nickname?: string;

  @IsDefined({ message: 'Поле не может быть пустым' })
  readonly password?: string;
}
