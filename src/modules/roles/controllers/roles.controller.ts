import { RequirePermissions } from '@/decorators';
import {
  PermissionAction,
  PermissionResource,
} from '@/modules/permissions/constants/permissions.enum';
import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { RolesService } from '../services/roles.service';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @RequirePermissions({ resource: PermissionResource.ROLES, action: PermissionAction.CREATE })
  @Post()
  async create(@Body() payload: CreateRoleDto) {
    return await this.rolesService.create(payload);
  }

  @RequirePermissions({ resource: PermissionResource.ROLES, action: PermissionAction.READ })
  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.rolesService.findAll(query);
  }

  @RequirePermissions({ resource: PermissionResource.ROLES, action: PermissionAction.READ })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findById(id);
  }

  @RequirePermissions({ resource: PermissionResource.ROLES, action: PermissionAction.UPDATE })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateRoleDto) {
    return await this.rolesService.update(id, payload);
  }

  @RequirePermissions({ resource: PermissionResource.ROLES, action: PermissionAction.DELETE })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.delete(id);
  }
}
