import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateUserDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/update-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ── Login pakai idKaryawan ──
  @Post('login')
  async login(@Body() body: { idKaryawan: string; password: string }) {
    return this.authService.login(body.idKaryawan, body.password);
  }

  // ── Bulk create dari Excel ──
  @Post('bulk-create-users')
  async bulkCreateUsers(@Body() body: { users: any[] }) {
    return this.authService.bulkCreateUsers(body.users);
  }

  // ── Get semua user ──
  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  // ── Lookup user by idKaryawan — dipakai form license-certification ──
  @UseGuards(JwtAuthGuard)
  @Get('users/by-id-karyawan/:idKaryawan')
  async getUserByIdKaryawan(@Param('idKaryawan') idKaryawan: string) {
    return this.authService.getUserByIdKaryawan(idKaryawan);
  }

  // ── Get user by ID ──
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // ── Assign supervisor ke user ──
  @Patch('users/:userId/supervisor')
  async assignSupervisor(
    @Param('userId') userId: string,
    @Body() body: { supervisorId: string },
  ) {
    return this.authService.assignSupervisor(userId, body.supervisorId);
  }

  // ────────────────────────────────────────────────────
  // TASK 1: Soft delete — deactivate user (set approved=false)
  // ────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Patch('users/:id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    return this.authService.deactivateUser(id);
  }

  // ── Reactivate user ──
  @UseGuards(JwtAuthGuard)
  @Patch('users/:id/activate')
  async activateUser(@Param('id') id: string) {
    return this.authService.activateUser(id);
  }

  // ────────────────────────────────────────────────────
  // TASK 2: Update user profile (name, jabatan, departemen, dll)
  // ────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, dto);
  }

  // ── Update role (admin only) ──
  @UseGuards(JwtAuthGuard)
  @Patch('users/:userId/role')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() body: { role: 'admin' | 'supervisor' | 'user' },
  ) {
    return this.authService.updateUserRole(userId, body.role);
  }

  // ────────────────────────────────────────────────────
  // TASK 3: Forgot password — request reset token
  // ────────────────────────────────────────────────────
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  // ── Validate reset token ──
  @Get('reset-password/:token/validate')
  async validateResetToken(@Param('token') token: string) {
    return this.authService.validateResetToken(token);
  }

  // ── Reset password dengan token ──
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ────────────────────────────────────────────────────
  // TASK 4: Change password — always use JWT id (never URL param)
  // ────────────────────────────────────────────────────

  // Primary endpoint: /me/change-password — no user ID needed in URL
  @UseGuards(JwtAuthGuard)
  @Post('me/change-password')
  async changePasswordMe(
    @Request() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, dto);
  }

  // Legacy endpoint: keep for backward compat but use JWT id, not URL param
  @UseGuards(JwtAuthGuard)
  @Post('users/:id/change-password')
  async changePassword(
    @Request() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
