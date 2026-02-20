import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Module } from '@nestjs/common';
import { Organization_feature_flagsController } from './controllers/organization_feature_flags.controller';
import { Organization_feature_flagsRepository } from './repository/organization_feature_flags.repository';
import { Organization_feature_flagsService } from './services/organization_feature_flags.service';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [Organization_feature_flagsController],
  providers: [Organization_feature_flagsService, Organization_feature_flagsRepository],
})
export class Organization_feature_flagsModule {}
