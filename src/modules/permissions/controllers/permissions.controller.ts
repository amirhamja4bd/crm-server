import { RequirePermissions } from '@/decorators';
import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionAction, PermissionResource } from '../constants/permissions.enum';
import { PermissionsService } from '../services/permissions.service';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @RequirePermissions({
    resource: PermissionResource.PERMISSIONS,
    action: PermissionAction.READ,
  })
  @Get()
  @ApiOperation({ summary: 'List all permissions (read-only)' })
  async findAll(@Query() query: PaginationDto) {
    return await this.permissionsService.findAll(query);
  }

  @RequirePermissions({
    resource: PermissionResource.PERMISSIONS,
    action: PermissionAction.READ,
  })
  @Get('grouped-by-resource')
  @ApiOperation({ summary: 'Get all permissions grouped by resource' })
  async findAllGroupedByResource() {
    return await this.permissionsService.findAllGroupedByResource();
  }

  @RequirePermissions({
    resource: PermissionResource.PERMISSIONS,
    action: PermissionAction.READ,
  })
  @Get('resource/:resource')
  @ApiOperation({ summary: 'Get permissions by resource' })
  async findByResource(@Param('resource') resource: string) {
    return await this.permissionsService.findByResource(resource);
  }

  @RequirePermissions({
    resource: PermissionResource.PERMISSIONS,
    action: PermissionAction.READ,
  })
  @Get(':id')
  @ApiOperation({ summary: 'Get permission by id (read-only)' })
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findById(id);
  }

  @RequirePermissions({
    resource: PermissionResource.PERMISSIONS,
    action: PermissionAction.CREATE,
  })
  @Post('seed')
  @ApiOperation({
    summary: 'Create all predefined permissions globally (no body, no params)',
  })
  async seed() {
    return await this.permissionsService.seedFromEnum();
  }
}
