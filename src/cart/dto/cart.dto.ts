import { IsMongoId, IsDefined } from 'class-validator';

export class CreateCartDto {
  @IsDefined({ message: 'Поле не может быть пустым' })
  @IsMongoId({ message: 'Некорректный идентификатор пользователя' })
  userId: string;

  products: string[];

  price: number;

  discoundSum: number;
}

export class updateCartDto {
  @IsDefined({ message: 'Поле не может быть пустым' })
  @IsMongoId({ message: 'Некорректный идентификатор продукта' })
  products: string[];
}
