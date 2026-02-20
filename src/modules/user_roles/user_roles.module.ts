import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Module } from '@nestjs/common';
import { User_rolesController } from './controllers/user_roles.controller';
import { User_rolesRepository } from './repository/user_roles.repository';
import { User_rolesService } from './services/user_roles.service';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [User_rolesController],
  providers: [User_rolesService, User_rolesRepository],
})
export class User_rolesModule {}
