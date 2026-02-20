import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Role_permissionsController } from './controllers/role_permissions.controller';
import { Role_permissionsService } from './services/role_permissions.service';
import { Role_permissionsRepository } from './repository/role_permissions.repository';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [Role_permissionsController],
  providers: [Role_permissionsService, Role_permissionsRepository],
})
export class Role_permissionsModule {}
