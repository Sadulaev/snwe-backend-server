import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
    async deleteFile(fileNmae: string) {
        try {
            let fs = require('fs');
            fs.unlink(`static/${fileNmae}`, err => {
                console.log('Файл успешно удалён');
            });
        } catch(e) {
            console.log('Такой фотки нет')
        }

    }
}
