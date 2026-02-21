import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { OrganizationsModule } from '@/modules/organizations/organizations.module';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [DatabaseModule, LibModule, OrganizationsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
