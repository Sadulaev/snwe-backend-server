import { IsDefined, Length, IsNotEmpty, IsNumber } from 'class-validator'


export class CreateMixtureDto {
    @IsDefined({ message: 'Поле не может быть пустым' })
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    image: string;

    @IsDefined({ message: 'Поле не может быть пустым' })
    @Length(3, 30, {message: 'Название смести должно быть длиной от 3-х до 30 символ'})
    title: string;

    @IsDefined({ message: 'Поле не может быть пустым' })
    @Length(1, 100, {message: 'Должна быть хотя бы одна строка информации'})
    info: string[];

    @IsDefined({ message: 'Поле не может быть пустым' })
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    @IsNumber({allowNaN: false, allowInfinity: false} , {message: 'Некорректное значение цены. Введите целочисленное значение'})
    twoWeekPrice: number;

    @IsDefined({ message: 'Поле не может быть пустым' })
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    @IsNumber({allowNaN: false, allowInfinity: false}, {message: 'Некорректное значение цены. Введите целочисленное значение'})
    twoMonthPrice: number;

    warnings: string[];
}

export class EditMixtureDto {
    @IsDefined({ message: 'Поле не может быть пустым' })
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    image?: string;

    @Length(3, 30, {message: 'Название смести должно быть длиной от 3-х до 30 символ'})
    title?: string;

    @Length(1, 100, {message: 'Должна быть хотя бы одна строка информации'})
    info?: string[];

    @IsNotEmpty({message: 'Значение не может быть пустым'})
    @IsNumber({allowNaN: false, allowInfinity: false} , {message: 'Некорректное значение цены. Введите целочисленное значение'})
    twoWeekPrice?: number;

    @IsNotEmpty({message: 'Значение не может быть пустым'})
    @IsNumber({allowNaN: false, allowInfinity: false}, {message: 'Некорректное значение цены. Введите целочисленное значение'})
    twoMonthPrice?: number;

    warnings?: string[]
}