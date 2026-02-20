const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const name = process.argv[2];

if (!name) {
  console.log('❌ Please provide module name');
  console.log('Example: npm run generate:module users');
  process.exit(1);
}

const basePath = path.join('src', 'modules', name);

function toPascalCase(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('');
}

function toSingularPascal(pluralName) {
  const singular = pluralName.endsWith('s')
    ? pluralName.slice(0, -1)
    : pluralName;
  return toPascalCase(singular);
}

const NamePascal = toPascalCase(name);
const SingularPascal = toSingularPascal(name);

function writeFile(relativePath, content) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

try {
  execSync(`nest g module modules/${name}`, { stdio: 'inherit' });

  fs.mkdirSync(path.join(basePath, 'controllers'), { recursive: true });
  fs.mkdirSync(path.join(basePath, 'services'), { recursive: true });
  fs.mkdirSync(path.join(basePath, 'repository'), { recursive: true });
  fs.mkdirSync(path.join(basePath, 'schemas'), { recursive: true });
  fs.mkdirSync(path.join(basePath, 'dtos'), { recursive: true });

  execSync(
    `nest g controller modules/${name}/controllers/${name} --flat`,
    { stdio: 'inherit' }
  );

  execSync(
    `nest g service modules/${name}/services/${name} --flat`,
    { stdio: 'inherit' }
  );

  writeFile(
    `${name}.module.ts`,
    `import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LibModule } from 'src/lib/lib.module';
import { ${NamePascal}Controller } from './controllers/${name}.controller';
import { ${NamePascal}Service } from './services/${name}.service';
import { ${NamePascal}Repository } from './repository/${name}.repository';

@Module({
  imports: [DatabaseModule, LibModule],
  controllers: [${NamePascal}Controller],
  providers: [${NamePascal}Service, ${NamePascal}Repository],
})
export class ${NamePascal}Module {}
`
  );

  writeFile(
    'index.ts',
    `export * from './controllers/${name}.controller';
export * from './dtos';
export * from './repository/${name}.repository';
export * from './schemas/schema';
export * from './services/${name}.service';
export * from './${name}.module';
`
  );

  writeFile(
    `controllers/${name}.controller.ts`,
    `import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Create${SingularPascal}Dto, Update${SingularPascal}Dto } from '../dtos';
import { ${NamePascal}Service } from '../services/${name}.service';

@ApiTags('${name}')
@Controller('${name}')
export class ${NamePascal}Controller {
  constructor(private readonly ${name}Service: ${NamePascal}Service) {}

  @Post()
  async create(@Body() payload: Create${SingularPascal}Dto) {
    return await this.${name}Service.create(payload);
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    return await this.${name}Service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.${name}Service.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: Update${SingularPascal}Dto) {
    return await this.${name}Service.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.${name}Service.delete(id);
  }
}
`
  );

  writeFile(
    `services/${name}.service.ts`,
    `import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { Create${SingularPascal}Dto, Update${SingularPascal}Dto } from '../dtos';
import { ${NamePascal}Repository } from '../repository/${name}.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class ${NamePascal}Service extends BaseService<
  typeof schema,
  typeof schema.${name}.$inferSelect,
  Create${SingularPascal}Dto,
  Update${SingularPascal}Dto
> {
  constructor(private readonly ${name}Repository: ${NamePascal}Repository) {
    super(${name}Repository);
  }
}
`
  );

  writeFile(
    `repository/${name}.repository.ts`,
    `import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { Create${SingularPascal}Dto, Update${SingularPascal}Dto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class ${NamePascal}Repository extends BaseRepository<
  typeof schema,
  typeof schema.${name}.$inferSelect,
  Create${SingularPascal}Dto,
  Update${SingularPascal}Dto
> {
  constructor() {
    super(schema, schema.${name}, [], []);
  }
}
`
  );

  writeFile(
    'schemas/schema.ts',
    `import { pgTable, text } from 'drizzle-orm/pg-core';
import { commonSchemaFieldsWithId } from 'src/shared/common-schemas/common-schema';

export const ${name} = pgTable('${name}', {
  ...commonSchemaFieldsWithId,
  name: text('name').notNull().default(''),
});
`
  );

  writeFile(
    `dtos/create-${name}.dto.ts`,
    `import { ApiProperty } from '@nestjs/swagger';

export class Create${SingularPascal}Dto {
  @ApiProperty({ example: '', description: '' })
  name!: string;
}
`
  );

  writeFile(
    `dtos/update-${name}.dto.ts`,
    `import { ApiPropertyOptional } from '@nestjs/swagger';
import { IBaseEntity } from '@/shared/types/types';

export class Update${SingularPascal}Dto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique identifier' })
  id?: string;

  @ApiPropertyOptional({ example: false, description: 'Soft delete flag' })
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
`
  );

  writeFile(
    `dtos/${name}-response.dto.ts`,
    `import { ApiProperty } from '@nestjs/swagger';

export class ${SingularPascal}ResponseDto {
  @ApiProperty({ example: 'uuid-or-id', description: 'Id' })
  id!: string;

  @ApiProperty({ example: true, description: 'Whether active' })
  status!: boolean;

  @ApiProperty({ example: '', description: '' })
  name!: string;
}
`
  );

  writeFile(
    'dtos/index.ts',
    `export * from './create-${name}.dto';
    export * from './update-${name}.dto';
    export * from './${name}-response.dto';
`
  );

  console.log(`\n✅ ${name} module structure created successfully!`);
} catch (error) {
  console.error('❌ Error creating module:', error.message);
}
