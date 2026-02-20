import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dtos';
import { OrganizationsService } from '../services/organizations.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  async create(@Body() payload: CreateOrganizationDto) {
    return await this.organizationsService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.organizationsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.organizationsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateOrganizationDto) {
    return await this.organizationsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.organizationsService.delete(id);
  }
}
