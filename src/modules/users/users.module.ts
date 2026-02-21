import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { User_rolesModule } from '@/modules/user_roles/user_roles.module';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [DatabaseModule, LibModule, OrganizationsModule, User_rolesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
