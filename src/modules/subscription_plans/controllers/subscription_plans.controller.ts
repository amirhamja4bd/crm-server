import { RequirePermissions } from '@/decorators';
import {
  PermissionAction,
  PermissionResource,
} from '@/modules/permissions/constants/permissions.enum';
import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSubscription_planDto, UpdateSubscription_planDto } from '../dtos';
import { Subscription_planResponseDto } from '../dtos/subscription_plans-response.dto';
import { Subscription_plansService } from '../services/subscription_plans.service';

@ApiTags('subscription_plans')
@ApiBearerAuth()
@Controller('subscription_plans')
export class Subscription_plansController {
  constructor(private readonly subscription_plansService: Subscription_plansService) {}

  @RequirePermissions({
    resource: PermissionResource.SUBSCRIPTION_PLANS,
    action: PermissionAction.CREATE,
  })
  @Post()
  @ApiOperation({ summary: 'Create subscription plan' })
  @ApiCreatedResponse({ description: 'Plan created', type: Subscription_planResponseDto })
  async create(@Body() payload: CreateSubscription_planDto) {
    return await this.subscription_plansService.create(payload);
  }

  @RequirePermissions({
    resource: PermissionResource.SUBSCRIPTION_PLANS,
    action: PermissionAction.READ,
  })
  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.subscription_plansService.findAll(query);
  }

  @RequirePermissions({
    resource: PermissionResource.SUBSCRIPTION_PLANS,
    action: PermissionAction.READ,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subscription_plansService.findById(id);
  }

  @RequirePermissions({
    resource: PermissionResource.SUBSCRIPTION_PLANS,
    action: PermissionAction.UPDATE,
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateSubscription_planDto) {
    return await this.subscription_plansService.update(id, payload);
  }

  @RequirePermissions({
    resource: PermissionResource.SUBSCRIPTION_PLANS,
    action: PermissionAction.DELETE,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.subscription_plansService.delete(id);
  }
}
