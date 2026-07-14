import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Smk3DataController } from './smk3-data.controller';
import { Smk3DataService } from './smk3-data.service';
import { Smk3Data } from './entities/smk3-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Smk3Data])],
  controllers: [Smk3DataController],
  providers: [Smk3DataService],
  exports: [Smk3DataService],
})
export class Smk3DataModule {}
