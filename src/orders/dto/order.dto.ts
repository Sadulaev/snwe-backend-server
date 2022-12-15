import { IsArray, IsBoolean, IsDefined, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @IsDefined({message: 'Id пользователя отсутствует'})
    @IsNotEmpty({message: 'Некорректный Id пользователя'})
    @IsMongoId({message: 'Некорректный Id пользователя'})
    userId: string;

    @IsArray({message: 'Неверный тип данных (питание)'})
    nutritions: string[];

    @IsArray({message: 'Неверный тип данных (смеси)'})
    mixtures: string[];

    @IsArray({message: 'Неверный тип данных (планы тренировок)'})
    trainPlans: string[];

    @IsDefined({message: 'Отсутствует итоговая цена заказа'})
    @IsNumber(
        { allowNaN: false, allowInfinity: false },
        { message: 'Некорректное значение цены' },
      )
    price: number;

    @IsDefined({message: 'Не указан тип доставки'})
    @IsBoolean({message: 'Неверный тип данных (доставка)'})
    isDelivery: boolean;

    @IsDefined({message: 'Отсутствуют данные о доставке'})
    @IsString({message: 'Неверный тип данных (адрес доставки)'})
    address: string | null;

}