import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategorySchema } from './category.model';
import { NutritionSchema } from './nutrition.model';
import { MixtureSchema } from './mixture.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Nutrition', schema: NutritionSchema },
      { name: 'Mixture', schema: MixtureSchema },
    ]),
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
