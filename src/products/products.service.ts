import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.model';
import { CreateCategoryDto, EditCategoryDto } from './dto/category.dto';
import { CreateMixtureDto, EditMixtureDto } from './dto/mixture.dto';
import { CreateNutritionDto, EditNutritionDto } from './dto/nutrition.dto';
import { Mixture, MixtureDocument } from './mixture.model';
import { Nutrition, NutritionDocument } from './nutrition.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Nutrition.name)
    private nutritionModel: Model<NutritionDocument>,
    @InjectModel(Mixture.name) private mixtureModel: Model<MixtureDocument>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const isUnique = await this.categoryModel
      .findOne({ title: createCategoryDto.title })
      .exec();
    if (isUnique) {
      throw new HttpException(
        'Категория с таким названием уже сущетсвует',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      new this.categoryModel(createCategoryDto).save();
      throw new HttpException(
        'Данные были успешно добавлены',
        HttpStatus.CREATED,
      );
    }
  }

  async editCategory(id: string, updatedData: EditCategoryDto) {
    if (updatedData.title) {
      const isUnique = await this.categoryModel.findOne({
        title: updatedData.title,
      });
      if (isUnique) {
        throw new HttpException(
          'Название категории не может повторяться',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const result = await this.categoryModel
      .findByIdAndUpdate(id, { ...updatedData })
      .exec();
    if (result) {
      throw new HttpException('Данные были успешно добавлены', HttpStatus.OK);
    } else {
      throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND);
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    const responce = await this.categoryModel.findById(id).exec();
    if (!responce) {
      throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND);
    } else {
      return responce;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async createMixture(createMixtureDto: CreateMixtureDto) {
    const isUnique = await this.mixtureModel
      .findOne({ title: createMixtureDto.title })
      .exec();
    if (isUnique) {
      throw new HttpException(
        'Смесь с таким названием уже сущетсвует',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      new this.mixtureModel(createMixtureDto).save();
      throw new HttpException('Данные были успешно добавлены', HttpStatus.OK);
    }
  }

  async editMixture(id: string, updatedData: EditMixtureDto) {
    if (updatedData.title) {
      const isUnique = await this.mixtureModel.findOne({
        title: updatedData.title,
      });
      if (isUnique) {
        throw new HttpException(
          'Название смеси не может повторяться',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const result = await this.mixtureModel
      .findByIdAndUpdate(id, { ...updatedData })
      .exec();
    if (result) {
      throw new HttpException('Данные были успешно добавлены', HttpStatus.OK);
    } else {
      throw new HttpException('Смесь не найдена', HttpStatus.NOT_FOUND);
    }
  }

  async getMixtureById(id: string): Promise<Mixture> {
    const responce = await this.mixtureModel.findById(id).exec();
    console.log(responce)
    if (!responce) {
      throw new HttpException('Смесь не найдена', HttpStatus.NOT_FOUND);
    } else {
      return responce;
    }
  }

  
  async getMixturesArrayById(mixtures: string[]) {
    try {
      const result = [];
      for(let mixture of mixtures) {
        result.push(await this.mixtureModel.findById(mixture))
      }
    } catch(e) {
      console.log(e)
      throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getAllMixtures(): Promise<Mixture[]> {
    return await this.mixtureModel.find().exec();
  }

  async searchMixtures(skip: string | number, counter: string | number) {
    skip = +skip || 0;
    counter = +counter || 0;
    const count = (await this.mixtureModel.find().exec()).length;
    const result = await this.mixtureModel
      .find()
      .skip(skip)
      .limit(counter);
    const currentCount = counter + skip;
    console.log(skip, counter);
    return { data: result, isMore: count >= currentCount };
  }

  async createNutrition(
    createNutritionDto: CreateNutritionDto,
  ): Promise<Nutrition> {
    const isUnique = await this.nutritionModel
      .findOne({ title: createNutritionDto.title })
      .exec();
    if (isUnique) {
      throw new HttpException(
        'Питание с таким названием уже сущетсвует',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const newNut = await new this.nutritionModel(createNutritionDto).save();
      if (newNut) {
        throw new HttpException('Данные были успешно добавлены', HttpStatus.OK);
      } else {
        throw new HttpException(
          'Ошибка на стороне сервера',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async editNutrition(id: string, updatedData: EditNutritionDto) {
    if (updatedData.title) {
      const isUnique = await this.nutritionModel.findOne({
        title: updatedData.title,
      });
      if (isUnique) {
        throw new HttpException(
          'Название питания не может повторяться',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const result = await this.nutritionModel
      .findByIdAndUpdate(id, { ...updatedData })
      .exec();
    if (result) {
      throw new HttpException('Данные были успешно добавлены', HttpStatus.OK);
    } else {
      throw new HttpException('Питание не найдено', HttpStatus.NOT_FOUND);
    }
  }

  async getNutritionById(id: string) {
    const responce = await this.nutritionModel.findById(id).exec();
    if (!responce) {
      throw new HttpException('Питание не найдено', HttpStatus.NOT_FOUND);
    } else {
      return responce;
    }
  }

  async getNutritionArrayById(nutritions: string[]) {
    console.log(nutritions)
    try {
      const result = [];
      for(let nutrition of nutritions) {
        result.push(await this.nutritionModel.findById(nutrition))
      }
    } catch(e) {
      console.log(e)
      throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getAllNutritions(): Promise<Nutrition[]> {
    return await this.nutritionModel.find().exec();
  }

  async searchNutritions(
    name: string | null,
    category: string | null,
    from: string,
    to: string,
    skip: string,
    counter: string,
  ) {
    const search = {};
    name ? (search['title'] = new RegExp('^' + name, 'i')) : '';
    category ? (search['category'] = category) : '';
    from || to
      ? (search['price'] = { $gt: +from - 1 || 0, $lt: +to + 1 || 10000000000000 })
      : '';

    // console.log(search, skip, counter)
    const count = (await this.nutritionModel.find(search).exec()).length;
    const result = await this.nutritionModel
      .find(search)
      .skip(+skip)
      .limit(+counter)
      .exec();
    const currentCount = +counter + (+skip || 0);
    return { data: result, isMore: count > currentCount };
  }
}
