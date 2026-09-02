import {
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';

export class UpdateFindingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
