import { Controller } from '@nestjs/common';
import { Get, Res, Param } from  '@nestjs/common';

@Controller('files')
export class FilesController {
    @Get('/:fileId')
    async serveFile(@Param('fileId') fileId, @Res() res): Promise<any> {
      res.sendFile(fileId, { root: 'static'});
    }
}
