import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationModulesController } from './organization_modules.controller';

describe('OrganizationModulesController', () => {
  let controller: OrganizationModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationModulesController],
    }).compile();

    controller = module.get<OrganizationModulesController>(OrganizationModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
