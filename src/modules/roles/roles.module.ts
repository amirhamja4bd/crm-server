import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { RolesRepository } from './repository/roles.repository';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
})
export class RolesModule {}
