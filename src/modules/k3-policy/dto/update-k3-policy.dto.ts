import { PartialType } from '@nestjs/mapped-types';
import { CreateK3PolicyDto } from './create-k3-policy.dto';

export class UpdateK3PolicyDto extends PartialType(CreateK3PolicyDto) {
    jenisKebijakan: undefined;
    judulKebijakan: undefined;
    tanggalPenetapan: undefined;
    penandatangan: undefined;
    jabatan: undefined;
    statusDokumen: undefined;
    statusDistribusi: undefined;
    statusValidasi: undefined;
    fileUrl: undefined;
}