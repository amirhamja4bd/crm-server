import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { DatabaseModule } from './database/database.module';
import { LibModule } from './lib/lib.module';
import { Feature_flagsModule } from './modules/feature_flags/feature_flags.module';
import { ModulesModule } from './modules/modules/modules.module';
import { Organization_feature_flagsModule } from './modules/organization_feature_flags/organization_feature_flags.module';
import { Organization_modulesModule } from './modules/organization_modules/organization_modules.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { Role_permissionsModule } from './modules/role_permissions/role_permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { Subscription_plansModule } from './modules/subscription_plans/subscription_plans.module';
import { User_rolesModule } from './modules/user_roles/user_roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    LibModule,
    CoreModule,
    OrganizationsModule,
    Feature_flagsModule,
    Organization_feature_flagsModule,
    Subscription_plansModule,
    ModulesModule,
    Organization_modulesModule,
    PermissionsModule,
    RolesModule,
    Role_permissionsModule,
    User_rolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
