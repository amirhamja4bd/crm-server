import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationModulesService } from './organization_modules.service';

describe('OrganizationModulesService', () => {
  let service: OrganizationModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationModulesService],
    }).compile();

    service = module.get<OrganizationModulesService>(OrganizationModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
