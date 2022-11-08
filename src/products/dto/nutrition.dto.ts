import { IsDefined, Length, IsNotEmpty, IsNumber } from 'class-validator'


export class CreateNutritionDto {
    @IsDefined({ message: 'Поле не может быть пустым' })
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    image: string;

    @IsDefined({ message: 'Поле не может быть пустым' })
    @Length(3, 30, {message: 'Название смести должно быть длиной от 3-х до 30 символ'})
    title: string;

    @IsDefined({ message: 'Поле не может быть пустым' })
    @Length(1, 100, {message: 'Должна быть хотя бы одна строка информации'})
    info: string;

    @IsDefined({ message: 'Поле не может быть пустым' })
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    @IsNumber({allowNaN: false, allowInfinity: false} , {message: 'Некорректное значение цены. Введите целочисленное значение'})
    price: number;

    @IsDefined({ message: 'Поле не может быть пустым' })
    category: string;

    warnings: string[];
}

export class EditNutritionDto {
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    image?: string;

    @Length(3, 30, {message: 'Название смести должно быть длиной от 3-х до 30 символ'})
    title?: string;

    @Length(1, 100, {message: 'Должна быть хотя бы одна строка информации'})
    info?: string;

    @IsNotEmpty({message: 'Значение не может быть пустым'})
    @IsNumber({allowNaN: false, allowInfinity: false} , {message: 'Некорректное значение цены. Введите целочисленное значение'})
    price?: number;
    
    @IsNotEmpty({message: 'Значение не может быть пустым'})
    category: string;

    warnings?: string[]
}