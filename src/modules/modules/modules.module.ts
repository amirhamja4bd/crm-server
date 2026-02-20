import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Module } from '@nestjs/common';
import { ModulesController } from './controllers/modules.controller';
import { ModulesRepository } from './repository/modules.repository';
import { ModulesService } from './services/modules.service';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [ModulesController],
  providers: [ModulesService, ModulesRepository],
})
export class ModulesModule {}
