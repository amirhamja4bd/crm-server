import { DatabaseModule } from '@/database/database.module';
import { LibModule } from '@/lib/lib.module';
import { Module } from '@nestjs/common';
import { Subscription_plansController } from './controllers/subscription_plans.controller';
import { Subscription_plansRepository } from './repository/subscription_plans.repository';
import { Subscription_plansService } from './services/subscription_plans.service';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [Subscription_plansController],
  providers: [Subscription_plansService, Subscription_plansRepository],
  exports: [Subscription_plansService],
})
export class Subscription_plansModule {}
