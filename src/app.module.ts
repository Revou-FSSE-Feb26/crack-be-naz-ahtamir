import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Smk3DataModule } from './modules/smk3-data/smk3-data.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'smk3_user',
      password: process.env.DATABASE_PASSWORD || 'smk3_password',
      database: process.env.DATABASE_NAME || 'smk3_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development', // Auto-sync schema in dev
      logging: process.env.NODE_ENV === 'development',
    }),

    // Modules
    AuthModule,
    UsersModule,
    Smk3DataModule,
    UploadsModule,
  ],
})
export class AppModule {}
