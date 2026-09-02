export class BulkCreateUserDto {
  idKaryawan: string;
  name: string;
  email: string;
  department?: string;
  jabatan?: string;
}

export class BulkCreateUsersRequestDto {
  users: BulkCreateUserDto[];
}
