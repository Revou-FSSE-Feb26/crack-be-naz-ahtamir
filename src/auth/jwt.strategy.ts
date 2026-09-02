import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Payload contains: id, idKaryawan, nama, role, departemen, supervisorId
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || !user.approved) {
      throw new UnauthorizedException('User tidak valid');
    }

    // Return user info that will be attached to request.user
    return {
      id: user.id,
      idKaryawan: user.idKaryawan,
      nama: user.nama,
      role: user.role,
      departemen: user.departemen,
      supervisorId: user.supervisorId,
    };
  }
}
