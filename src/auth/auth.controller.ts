import { Controller, Post, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Login pakai idKaryawan
  @Post('login')
  async login(@Body() body: { idKaryawan: string; password: string }) {
    return this.authService.login(body.idKaryawan, body.password);
  }

  // Bulk create dari Excel
  @Post('bulk-create-users')
  async bulkCreateUsers(@Body() body: { users: any[] }) {
    return this.authService.bulkCreateUsers(body.users);
  }

  // Get semua user
  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  // Lookup user by idKaryawan — dipakai form license-certification
  @UseGuards(JwtAuthGuard)
  @Get('users/by-id-karyawan/:idKaryawan')
  async getUserByIdKaryawan(@Param('idKaryawan') idKaryawan: string) {
    return this.authService.getUserByIdKaryawan(idKaryawan);
  }

  // Assign supervisor ke user
  @Patch('users/:userId/supervisor')
  async assignSupervisor(
    @Param('userId') userId: string,
    @Body() body: { supervisorId: string },
  ) {
    return this.authService.assignSupervisor(userId, body.supervisorId);
  }
}