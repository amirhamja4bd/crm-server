import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Subscription_plansModule } from '@/modules/subscription_plans/subscription_plans.module';
import { Module } from '@nestjs/common';
import { OrganizationsController } from './controllers/organizations.controller';
import { OrganizationsRepository } from './repository/organizations.repository';
import { OrganizationsService } from './services/organizations.service';

@Module({
  imports: [DatabaseModule, LibModule, Subscription_plansModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationsRepository],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
