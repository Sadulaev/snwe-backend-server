import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
    let productsController: ProductsController;
    let productsService: ProductsService;

    const categories = [
        { title: "hello", description: "new desc" }
    ]

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [ProductsService],
        }).compile();

        productsService = moduleRef.get<ProductsService>(ProductsService);
        productsController = moduleRef.get<ProductsController>(ProductsController);
    });

    categories.map(value => {
        describe('createCategory', () => {
            it('shoul return 200 and message', async () => {
                // const result = [{statusCode: 200, message: "Данные были успешно добавлены"}]
                // jest.spyOn(productsService, 'createCategory').mockImplementation(() => result)

                expect(await productsController.createCategory(value)).toHaveProperty('statusCode', 200)
            })
        })
    })

})