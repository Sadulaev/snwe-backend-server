import { IsArray, IsBoolean, IsDefined, isMongoId, IsMongoId, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { AdminType, UserType } from "../chat.model";

export class UserCreateChatDto {
  @IsDefined({ message: 'Не указаны данные пользователя' })
  user: UserType;

  @IsDefined({ message: 'Нет данных сообщения' })
  @IsNotEmpty({ message: 'Нельзя создать пустое сообщение' })
  message: string;
}

export class NewMessageDto {
  from: 'user' | 'admin';

  @IsDefined({ message: 'Не указаны данные пользователя' })
  @IsNotEmpty({ message: 'Нельзя создать пустое сообщение' })
  message: string;

  timestamp: Date;
}