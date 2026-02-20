import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Feature_flagsController } from './controllers/feature_flags.controller';
import { Feature_flagsService } from './services/feature_flags.service';
import { Feature_flagsRepository } from './repository/feature_flags.repository';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [Feature_flagsController],
  providers: [Feature_flagsService, Feature_flagsRepository],
})
export class Feature_flagsModule {}
