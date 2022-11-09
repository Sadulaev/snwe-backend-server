import { Controller, Post, Put, Get, Param, Body } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateCategoryDto, EditCategoryDto } from './dto/category.dto';
import { CreateMixtureDto, EditMixtureDto } from './dto/mixture.dto';
import { CreateNutritionDto, EditNutritionDto } from './dto/nutrition.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Post('/category/create')
    async createCategory(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto) {
        return this.productsService.createCategory(createCategoryDto)
    }

    @Put('/category/edit/:id')
    async editCategory(@Param('id') id: string, @Body(new ValidationPipe()) editCategoryDto: EditCategoryDto) {
        return this.productsService.editCategory(id, editCategoryDto)
    }

    @Get('/category/getById/:id')
    async getCategoryById(@Param('id') id: string) {
        return this.productsService.getCategoryById(id)
    }

    @Get('/category/getAll')
    async getAllCategories() {
        return this.productsService.getAllCategories()
    }

    @Post('/nutrition/create')
    async createNutrition(@Body(new ValidationPipe()) createNutritionDto: CreateNutritionDto) {
        return this.productsService.createNutrition(createNutritionDto)
    }

    @Put('/nutrition/edit/:id')
    async editNutrition(@Param('id') id: string, @Body(new ValidationPipe()) editNutritionDto: EditNutritionDto) {
        return this.productsService.editNutrition(id, editNutritionDto)
    }

    @Get('/nutrition/getById/:id')
    async getNutritionById(@Param('id') id: string) {
        return this.productsService.getNutritionById(id)
    }

    @Get('/nutrition/getAll')
    async getAllNutritions() {
        return this.productsService.getAllNutritions()
    }

    @Post('/nutrition/create')
    async createMixture(@Body(new ValidationPipe()) createMixtureDto: CreateMixtureDto) {
        return this.productsService.createMixture(createMixtureDto)
    }

    @Put('/mixture/edit/:id')
    async editMixture(@Param('id') id: string, @Body(new ValidationPipe()) editMixtureDto: EditMixtureDto) {
        return this.productsService.editMixture(id, editMixtureDto)
    }

    @Get('/mixture/getById/:id')
    async getMixtureById(@Param('id') id: string) {
        return this.productsService.getMixtureById(id)
    }

    @Get('/mixture/getAll')
    async getAllMixtures() {
        return this.productsService.getAllMixtures()
    }
}
