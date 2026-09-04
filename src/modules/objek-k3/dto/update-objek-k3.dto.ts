import { PartialType } from '@nestjs/mapped-types';
import { CreateObjekK3Dto } from './create-objek-k3.dto';

export class UpdateObjekK3Dto extends PartialType(CreateObjekK3Dto) {}
