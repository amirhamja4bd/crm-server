import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRole_permissionDto, UpdateRole_permissionDto } from '../dtos';
import { Role_permissionsService } from '../services/role_permissions.service';

@ApiTags('role_permissions')
@Controller('role_permissions')
export class Role_permissionsController {
  constructor(private readonly role_permissionsService: Role_permissionsService) {}

  @Post()
  async create(@Body() payload: CreateRole_permissionDto) {
    return await this.role_permissionsService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.role_permissionsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.role_permissionsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateRole_permissionDto) {
    return await this.role_permissionsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.role_permissionsService.delete(id);
  }
}
