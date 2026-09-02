import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';

export class CreateFindingDto {
  @IsString()
  @IsNotEmpty()
  subElementId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(['INPG', 'CLSD'])
  @IsOptional()
  findingStatus?: 'INPG' | 'CLSD';

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsOptional()
  files?: any;
}
