import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganization_moduleDto, UpdateOrganization_moduleDto } from '../dtos';
import { Organization_modulesService } from '../services/organization_modules.service';

@ApiTags('organization_modules')
@Controller('organization_modules')
export class Organization_modulesController {
  constructor(private readonly organization_modulesService: Organization_modulesService) {}

  @Post()
  async create(@Body() payload: CreateOrganization_moduleDto) {
    return await this.organization_modulesService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.organization_modulesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.organization_modulesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateOrganization_moduleDto) {
    return await this.organization_modulesService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.organization_modulesService.delete(id);
  }
}
