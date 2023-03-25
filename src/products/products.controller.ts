import { Controller, Post, Put, Get, Param, Body, Query, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express"
import { Mongoose, ObjectId } from 'mongoose';
import { diskStorage } from 'multer'
import { extname } from 'path';
import { imageFileFilter } from 'src/utils/file-upload.utils';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreateCategoryDto, EditCategoryDto } from './dto/category.dto';
import { CreateMixtureDto, EditMixtureDto } from './dto/mixture.dto';
import { CreateNutritionDto, EditNutritionDto } from './dto/nutrition.dto';
import { ProductsService } from './products.service';


@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('/category/create')
  async createCategory(
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
  ) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Put('/category/edit/:id')
  async editCategory(
    @Param('id') id: string,
    @Body(new ValidationPipe()) editCategoryDto: EditCategoryDto,
  ) {
    return this.productsService.editCategory(id, editCategoryDto);
  }

  @Delete('/category/delete')
  async deleteCategory(@Query('id') id: string) {
    return this.productsService.deleteCategory(id)
  }

  @Post('/category/getAll')
  async getAllCategories() {
    return this.productsService.getAllCategories(); 
  }

  @Post('/nutrition/create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './static',
      filename: (req, file, cb) => {
        const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      },
    }),
    fileFilter: imageFileFilter,
  }))
  async createNutrition(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNutritionDto
  ) {
    console.log(createNutritionDto)
    return this.productsService.createNutrition({image: file?.filename || '', ...createNutritionDto, warnings: createNutritionDto.warnings.split(',')});
  }

  @Post('/nutrition/update/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './static',
      filename: (req, file, cb) => {
        const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      },
    }),
    fileFilter: imageFileFilter,
  }))
  async editNutrition(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() editNutritionDto
  ) {
    console.log(file)
    return this.productsService.editNutrition(id, {image: file?.filename || '', ...editNutritionDto, warnings: editNutritionDto.warnings.split(',')});
  }

  // @Put('/nutrition/update/:id')
  // async editNutrition(
  //   @Param('id') id: string,
  //   @Body() editNutritionDto: EditNutritionDto,
  // ) {
  //   return this.productsService.editNutrition(id, editNutritionDto);
  // }

  @Get('/nutrition/getById/:id') 
  async getNutritionById(@Param('id') id: string) {
    return this.productsService.getNutritionById(id);
  }

  @Get('/nutrition/getArrayById')
  async getNutritionArrayById(@Body() nutritions: string[]) {
    console.log(nutritions)
    return this.productsService.getNutritionArrayById(nutritions)
  }

  @Get('/nutrition/getAll')
  async getAllNutritions() {
    return this.productsService.getAllNutritions();
  }

  @Get('/nutritions/getByQuery')
  async getNutritionsByQuery(
    @Query('title') title: string,
    @Query('category') category: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('skip') skip: string,
    @Query('counter') counter: string,
  ) {
    return this.productsService.searchNutritions(
      title,
      category,
      from,
      to,
      skip,
      counter,
    );
  }


  @Post('/mixture/create')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './static',
      filename: (req, file, cb) => {
        const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      },
    }),
    fileFilter: imageFileFilter,
  }))
  async createMixture(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMixtureDto
  ) {
    return await this.productsService.createMixture({image: file?.filename || '', ...createMixtureDto, warnings: createMixtureDto.warnings.split(',')});
  }

  @Post('/mixture/update/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './static',
      filename: (req, file, cb) => {
        const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('')
        return cb(null, `${randomName}${extname(file.originalname)}`)
      },
    }),
    fileFilter: imageFileFilter,
  }))
  async editMixture(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() editMixtureDto
  ) {
    console.log(file)
    return this.productsService.editMixture(id, {image: file?.filename || '', ...editMixtureDto, warnings: editMixtureDto.warnings.split(',')});
  }

  // @Get('/mixture/getById/:id')
  // async getMixtureById(@Param('id') id: string) {
  //   return this.productsService.getMixtureById(id);
  // }

  @Get('/mixture/getArrayById')
  async getMixturesArrayById(@Body() mixtures: string[]) {
    return this.productsService.getMixturesArrayById(mixtures)
  }

  @Get('/mixture/getAll')
  async getAllMixtures() {
    return this.productsService.getAllMixtures();
  }

  @Get('/mixtures/getByQuery')
  async getMixturesByQuery(
    @Query('skip') skip: string,
    @Query('counter') counter: string,
  ) {
    // console.log(skip, counter);
    return this.productsService.searchMixtures(skip, counter);
  }

  @Post('/getByParams')
  async getProductsByParams(@Body() data: {count: number, page: number, type: string}) {
    const COUNT = data.count;
    const PAGE = data.page;
    const TYPE = data.type
    return this.productsService.getProductsByParams(COUNT, PAGE, TYPE)
  }
  
  @Post('/deleteByParams')
  async deleteProduct(@Body() data: {id: string, type: string}) {
    return await this.productsService.deleteProduct(data.id, data.type)
  }
}