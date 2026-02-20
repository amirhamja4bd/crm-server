import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFeature_flagDto, UpdateFeature_flagDto } from '../dtos';
import { Feature_flagsService } from '../services/feature_flags.service';

@ApiTags('feature_flags')
@Controller('feature_flags')
export class Feature_flagsController {
  constructor(private readonly feature_flagsService: Feature_flagsService) {}

  @Post()
  async create(@Body() payload: CreateFeature_flagDto) {
    return await this.feature_flagsService.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.feature_flagsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.feature_flagsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateFeature_flagDto) {
    return await this.feature_flagsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.feature_flagsService.delete(id);
  }
}
