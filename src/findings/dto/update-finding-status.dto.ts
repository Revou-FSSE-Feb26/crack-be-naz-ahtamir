import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFindingStatusDto {
  @IsEnum(['INPG', 'CLSD'])
  @IsNotEmpty()
  findingStatus: 'INPG' | 'CLSD';

  @IsOptional()
  @IsString()
  approvalNote?: string;

  @IsOptional()
  @IsEnum(['ACC', 'TACC'])
  approvalStatus?: 'ACC' | 'TACC';

  @IsOptional()
  @IsString()
  picId?: string;

  @IsOptional()
  @IsString()
  followUpNote?: string;

  @IsOptional()
  @IsString()
  followUpDeadline?: string;
}
