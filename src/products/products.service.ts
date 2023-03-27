import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
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
    private fileService: FilesService,
  ) { }

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
      return await new this.categoryModel(createCategoryDto).save();
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

  async deleteCategory(id) {
    return await this.categoryModel.findByIdAndDelete(id).exec()
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async createMixture(
    createMixtureDto: CreateMixtureDto,
  ): Promise<Mixture> {
    console.log(createMixtureDto)
    const isUnique = await this.mixtureModel
      .findOne({ title: createMixtureDto.title })
      .exec();
    if (isUnique) {
      throw new HttpException(
        'Питание с таким названием уже сущетсвует',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      try {
        return await new this.mixtureModel(createMixtureDto).save();
      } catch (e) {
        console.log(e)
        throw new HttpException(
          'Ошибка на стороне сервера',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async editMixture(id: string, updatedData: EditMixtureDto) {
    try {
      const isUnique = await this.mixtureModel.find({
        title: updatedData.title
      })
    if (updatedData.title) {
      if (isUnique.length > 1) {
        throw new HttpException(
          'Название смеси не может повторяться',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (isUnique[0]?.image && updatedData?.image !== isUnique[0].image) {
      this.fileService.deleteFile(isUnique[0].image)
    }
  } catch (e) {
    console.log(e)
    throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
  }
    try {
      return await this.mixtureModel
        .findByIdAndUpdate(id, { ...updatedData, }, { new: true })
        .exec();
    } catch (e) {
      throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMixtureById(id: string): Promise<Mixture> {
    try {
      return await this.mixtureModel.findById(id).exec();
    } catch (e) {
      throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async getMixturesArrayById(mixtures: string[]) {
    try {
      const result = [];
      for (let mixture of mixtures) {
        result.push(await this.mixtureModel.findById(mixture))
      }
    } catch (e) {
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
      try {
        return await new this.nutritionModel(createNutritionDto).save();
      } catch (e) {
        console.log(e)
        throw new HttpException(
          'Ошибка на стороне сервера',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async editNutrition(id: string, updatedData: EditNutritionDto) {
      try {
        const isUnique = await this.nutritionModel.find({
          title: updatedData.title
        })
      if (updatedData.title) {
        if (isUnique.length > 1) {
          throw new HttpException(
            'Название питания не может повторяться',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (isUnique[0].image && updatedData.image !== isUnique[0].image) {
        this.fileService.deleteFile(isUnique[0].image)
      }
    } catch (e) {
      console.log(e)
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
      try {
        return await this.nutritionModel
          .findByIdAndUpdate(id, { ...updatedData, }, { new: true })
          .exec();
      } catch (e) {
        throw new HttpException('Ошмбка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

  async getNutritionById(id: string) {
      try {
        return await this.nutritionModel.findById(id).exec();
      } catch (e) {
        throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

  async getNutritionArrayById(nutritions: string[]) {
      console.log(nutritions)
      try {
        const result = [];
        for (let nutrition of nutritions) {
          result.push(await this.nutritionModel.findById(nutrition))
        }
      } catch (e) {
        console.log(e)
        throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

  async getAllNutritions(): Promise < Nutrition[] > {
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

  async getProductsByParams(count: number, page: number, type: string) {
      const skipFrom = (page - 1) * count;
      try {
        if (type === 'NUTRITIONS') {
          const result = await this.nutritionModel.find().skip(skipFrom).limit(count)
          const pages = Math.ceil((await this.nutritionModel.countDocuments()) / count)
          return { NUTRITIONS: result, pagesCount: pages }
        } else if (type === 'MIXTURES') {
          const result = await this.mixtureModel.find().skip(skipFrom).limit(count)
          const pages = Math.ceil((await this.mixtureModel.countDocuments()) / count)
          return { MIXTURES: result, pagesCount: pages }
        }
      } catch (e) {
        throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

  async deleteProduct(id: string, type: string) {
      console.log(id, type)
      if (type === 'NUTRITIONS') {
        try {
          const result = await this.nutritionModel.findById(id)
          console.log(result)
          if(result.image) this.fileService.deleteFile(result.image)
          await this.nutritionModel.findByIdAndDelete(id).exec()
        } catch (e) {
          console.log(e)
          throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        throw new HttpException('Успешно удалено', HttpStatus.OK)
      } else if (type === 'MIXTURES') {
        try {
          const result = await this.mixtureModel.findById(id)
          console.log(result)
          if(result.image) this.fileService.deleteFile(result.image)
          await this.mixtureModel.findByIdAndDelete(id).exec()
        } catch (e) {
          console.log(e)
          throw new HttpException('Ошибка на стороне сервера', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        throw new HttpException('Успешно удалено', HttpStatus.OK)
      }
    }
  }

