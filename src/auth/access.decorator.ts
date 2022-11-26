import { SetMetadata } from '@nestjs/common';

export const ACCESS_KEY = 'accessLvl';
export const Access = (accessLvl: number[]) =>
  SetMetadata(ACCESS_KEY, accessLvl);
