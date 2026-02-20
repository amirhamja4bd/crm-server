import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { RolesService } from '../services/roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() payload: CreateRoleDto) {
    return await this.rolesService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.rolesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateRoleDto) {
    return await this.rolesService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.delete(id);
  }
}
