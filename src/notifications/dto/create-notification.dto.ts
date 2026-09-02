import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['finding_submitted', 'approval_required', 'finding_approved', 'finding_rejected'])
  @IsNotEmpty()
  type: 'finding_submitted' | 'approval_required' | 'finding_approved' | 'finding_rejected';

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsOptional()
  findingId?: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
