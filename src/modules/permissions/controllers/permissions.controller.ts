import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos';
import { PermissionsService } from '../services/permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() payload: CreatePermissionDto) {
    return await this.permissionsService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.permissionsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdatePermissionDto) {
    return await this.permissionsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.permissionsService.delete(id);
  }
}
