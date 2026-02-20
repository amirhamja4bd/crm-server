import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationsRepository } from './repository/organizations.repository';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
})
export class OrganizationsModule {}
