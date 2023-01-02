import { IsArray, IsBoolean, IsDefined, IsMongoId, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";

interface Product {
  _id: string,
  count: number,
}

class UserAddress {
  @IsDefined({ message: 'Не указан город' })
  @IsNotEmpty({ message: 'Не указан город' })
  city: string;

  @IsDefined({ message: 'Не указана улица' })
  @IsNotEmpty({ message: 'Не указана улица' })
  street: string;

  @IsDefined({ message: 'Не указан номер дома' })
  @IsNotEmpty({ message: 'Не указан номер дома' })
  house: string;

  @IsDefined({ message: 'Не указан почтовый индекс' })
  @IsNotEmpty({ message: 'Не указан почтовый индекс' })
  index: string;
}

class UserInfo {
  @IsDefined({ message: 'Не указано имя' })
  @IsNotEmpty({ message: 'Не указано имя' })
  name: string;

  @IsDefined({ message: 'Не указана почта' })
  @IsNotEmpty({ message: 'Не указана почта' })
  email: string;

  @IsDefined({ message: 'Не указан номер телефона' })
  @IsNotEmpty({ message: 'Не указан номер телефона' })
  number: string;
}

export class CreateOrderDto {
  userId?: string;

  @IsDefined({message: 'Не указаны данные пользователя'})
  userInfo: UserInfo;

  @IsDefined({ message: 'Отсутствуют данные о доставке' })
  userAddress: UserAddress;

  @IsArray({ message: 'Неверный тип данных (питание)' })
  nutritions: Product[];

  @IsArray({ message: 'Неверный тип данных (смеси)' })
  mixtures: Product[];

  // @IsArray({ message: 'Неверный тип данных (планы тренировок)' })
  trainPlans?: string[];

  total?: number;

  @IsDefined({ message: 'Не указан тип доставки' })
  @IsBoolean({ message: 'Неверный тип данных (доставка)' })
  isDelivery: boolean;
}