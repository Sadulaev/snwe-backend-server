export class CreateAdminDto {
  constructor(userId, nickname, password) {
    this.userId = userId;
    this.nickname = nickname;
    this.password = password;
  }

  readonly userId: string;

  readonly nickname: string;

  readonly password: string;
}
