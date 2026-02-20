import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateModuleDto, UpdateModuleDto } from '../dtos';
import { ModulesService } from '../services/modules.service';

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async create(@Body() payload: CreateModuleDto) {
    return await this.modulesService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.modulesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.modulesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateModuleDto) {
    return await this.modulesService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.modulesService.delete(id);
  }
}
