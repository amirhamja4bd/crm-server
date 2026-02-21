import type { UserRequestType } from '@/database/schema';
import { CurrentUser, Public, RequirePermissions } from '@/decorators';
import {
  PermissionAction,
  PermissionResource,
} from '@/modules/permissions/constants/permissions.enum';
import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto, RefreshTokenDto, UpdateUserDto } from '../dtos';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.usersService.create(payload);
  }

  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return await this.usersService.login(payload);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return await this.usersService.refreshToken(payload.refreshToken);
  }

  @Post('logout')
  async logout(@CurrentUser() user: UserRequestType) {
    return await this.usersService.logout(user.id);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: UserRequestType) {
    const { password: _password, refreshToken: _refreshToken, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  @RequirePermissions({ resource: PermissionResource.USERS, action: PermissionAction.READ })
  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.usersService.findAll(query);
  }

  @RequirePermissions({ resource: PermissionResource.USERS, action: PermissionAction.READ })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @RequirePermissions({ resource: PermissionResource.USERS, action: PermissionAction.UPDATE })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return await this.usersService.update(id, payload);
  }

  @RequirePermissions({ resource: PermissionResource.USERS, action: PermissionAction.DELETE })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
