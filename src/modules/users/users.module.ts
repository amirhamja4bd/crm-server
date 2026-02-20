import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repository/users.repository';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
