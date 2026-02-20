import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Module } from '@nestjs/common';
import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsRepository } from './repository/permissions.repository';
import { PermissionsService } from './services/permissions.service';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
