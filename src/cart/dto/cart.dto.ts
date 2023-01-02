import { IsMongoId, IsDefined } from 'class-validator';

export class CreateCartDto {
  @IsDefined({ message: 'Поле не может быть пустым' })
  @IsMongoId({ message: 'Некорректный идентификатор пользователя' })
  userId: string;
}

export class UpdateCartDto {
  @IsDefined({ message: 'Поле идентификатора продукта не может быть пустым' })
  productId: string;
  @IsDefined({message: 'Поле типа продукта не может быть пустым'})
  type: 'mixture' | 'nutrition';
}

interface Product {
  _id: string,
  count: number,
}

export class CalculatePrice {
  nutritions?: Product[] = [];
  mixtures?: Product[] = [];
}
