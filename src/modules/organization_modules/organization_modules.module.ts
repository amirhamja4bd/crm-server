import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Module } from '@nestjs/common';
import { Organization_modulesController } from './controllers/organization_modules.controller';
import { Organization_modulesRepository } from './repository/organization_modules.repository';
import { Organization_modulesService } from './services/organization_modules.service';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [Organization_modulesController],
  providers: [Organization_modulesService, Organization_modulesRepository],
})
export class Organization_modulesModule {}
