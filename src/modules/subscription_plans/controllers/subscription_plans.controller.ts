import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSubscription_planDto, UpdateSubscription_planDto } from '../dtos';
import { Subscription_plansService } from '../services/subscription_plans.service';

@ApiTags('subscription_plans')
@Controller('subscription_plans')
export class Subscription_plansController {
  constructor(private readonly subscription_plansService: Subscription_plansService) {}

  @Post()
  async create(@Body() payload: CreateSubscription_planDto) {
    return await this.subscription_plansService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.subscription_plansService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subscription_plansService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateSubscription_planDto) {
    return await this.subscription_plansService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.subscription_plansService.delete(id);
  }
}
