import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationFeatureFlagsController } from './organization_feature_flags.controller';

describe('OrganizationFeatureFlagsController', () => {
  let controller: OrganizationFeatureFlagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationFeatureFlagsController],
    }).compile();

    controller = module.get<OrganizationFeatureFlagsController>(OrganizationFeatureFlagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
