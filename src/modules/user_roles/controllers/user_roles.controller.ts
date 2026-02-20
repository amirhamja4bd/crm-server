import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUser_roleDto, UpdateUser_roleDto } from '../dtos';
import { User_rolesService } from '../services/user_roles.service';

@ApiTags('user_roles')
@Controller('user_roles')
export class User_rolesController {
  constructor(private readonly user_rolesService: User_rolesService) {}

  @Post()
  async create(@Body() payload: CreateUser_roleDto) {
    return await this.user_rolesService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.user_rolesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.user_rolesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateUser_roleDto) {
    return await this.user_rolesService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.user_rolesService.delete(id);
  }
}
