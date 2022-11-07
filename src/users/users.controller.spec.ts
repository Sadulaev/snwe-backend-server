import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
// import { User, UserDocument } from './user.model';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
import { Test } from '@nestjs/testing'

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    const users = [
        {nickname: 'Ismail', email: 'ismail@mail.ru', number: '8(929)909 00 33', password: 'Assassin1234*'}
    ]

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService)
        usersController = moduleRef.get<UsersController>(UsersController)
    });

    describe('createUser', () => {
        it('should return a succesfully registered user info', async () => {
            // const result = ['test']
            // jest.spyOn(usersService, 'createUser').mockImplementation(() => result)

            expect(typeof(await usersController.createUser(users[0]))).toEqual(typeof({}))
        })
    })
})