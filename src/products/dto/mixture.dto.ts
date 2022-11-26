import {
  IsDefined,
  Length,
  IsNotEmpty,
  IsNumber,
  ArrayMinSize,
  IsArray,
} from 'class-validator';

export class CreateMixtureDto {
  @IsDefined({ message: 'Поле не может быть пустым' })
  @IsNotEmpty({ message: 'Значение не может быть пустым' })
  readonly image: string;

  @IsDefined({ message: 'Поле не может быть пустым' })
  @Length(3, 30, {
    message: 'Название смести должно быть длиной от 3-х до 30 символ',
  })
  readonly title: string;

  @IsDefined({ message: 'Поле не может быть пустым' })
  @ArrayMinSize(1, { message: 'Должна быть хотя бы одна строка информации' })
  readonly info: string[];

  @IsDefined({ message: 'Поле не может быть пустым' })
  @IsNotEmpty({ message: 'Значение не может быть пустым' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Некорректное значение цены. Введите целочисленное значение' },
  )
  readonly twoWeekPrice: number;

  @IsDefined({ message: 'Поле не может быть пустым' })
  @IsNotEmpty({ message: 'Значение не может быть пустым' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Некорректное значение цены. Введите целочисленное значение' },
  )
  readonly twoMonthPrice: number;

  @IsArray({ message: 'Неверный формат данных' })
  readonly warnings: string[];
}

export class EditMixtureDto {
  @IsNotEmpty({ message: 'Значение не может быть пустым' })
  readonly image?: string;

  @Length(3, 30, {
    message: 'Название смести должно быть длиной от 3-х до 30 символ',
  })
  readonly title?: string;

  @ArrayMinSize(1, { message: 'Должна быть хотя бы одна строка информации' })
  readonly info?: string[];

  @IsNotEmpty({ message: 'Значение не может быть пустым' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Некорректное значение цены. Введите целочисленное значение' },
  )
  readonly twoWeekPrice?: number;

  @IsNotEmpty({ message: 'Значение не может быть пустым' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Некорректное значение цены. Введите целочисленное значение' },
  )
  readonly twoMonthPrice?: number;

  @IsArray({ message: 'Неверный формат данных' })
  readonly warnings: string[];
}
