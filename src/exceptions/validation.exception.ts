import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  messages;

  constructor(responce) {
    super(responce, HttpStatus.BAD_REQUEST);
    this.messages = responce;
  }
}

export class DuplicationException extends HttpException {
  messages;

  constructor(responce) {
    super(responce, HttpStatus.FORBIDDEN);
    this.messages = responce;
  }
}