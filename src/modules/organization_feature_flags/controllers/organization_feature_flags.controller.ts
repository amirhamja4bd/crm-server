import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganization_feature_flagDto, UpdateOrganization_feature_flagDto } from '../dtos';
import { Organization_feature_flagsService } from '../services/organization_feature_flags.service';

@ApiTags('organization_feature_flags')
@Controller('organization_feature_flags')
export class Organization_feature_flagsController {
  constructor(private readonly organization_feature_flagsService: Organization_feature_flagsService) {}

  @Post()
  async create(@Body() payload: CreateOrganization_feature_flagDto) {
    return await this.organization_feature_flagsService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.organization_feature_flagsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.organization_feature_flagsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateOrganization_feature_flagDto) {
    return await this.organization_feature_flagsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.organization_feature_flagsService.delete(id);
  }
}
