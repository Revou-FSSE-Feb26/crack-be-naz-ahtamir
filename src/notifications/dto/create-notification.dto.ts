import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum([
    'finding_submitted',
    'approval_required',
    'finding_approved',
    'finding_rejected',
    'deadline_reminder',
    'license_expiring_soon',
    'license_expired',
  ])
  @IsNotEmpty()
  type:
    | 'finding_submitted'
    | 'approval_required'
    | 'finding_approved'
    | 'finding_rejected'
    | 'deadline_reminder'
    | 'license_expiring_soon'
    | 'license_expired';

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
