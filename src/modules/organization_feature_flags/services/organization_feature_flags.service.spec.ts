import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationFeatureFlagsService } from './organization_feature_flags.service';

describe('OrganizationFeatureFlagsService', () => {
  let service: OrganizationFeatureFlagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationFeatureFlagsService],
    }).compile();

    service = module.get<OrganizationFeatureFlagsService>(OrganizationFeatureFlagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
