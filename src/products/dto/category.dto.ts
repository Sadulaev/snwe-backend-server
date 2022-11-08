import {IsDefined, Length, IsNotEmpty} from 'class-validator'

export class CreateCategoryDto {
    @IsDefined()
    @Length(2, 30, {message: 'Название категории должно быть от 2-х до 30 символов'})
    readonly title: string;

    @IsDefined()
    @IsNotEmpty({message: 'Описание категории не может быть пустым'})
    readonly description: string;
}

export class EditCategoryDto {

    @Length(2, 30, {message: 'Название категории должно быть от 2-х до 30 символов'})
    readonly title?: string;

    @IsNotEmpty({message: 'Описание категории не может быть пустым'})
    readonly description?: string;
}