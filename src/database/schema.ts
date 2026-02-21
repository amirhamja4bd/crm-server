export * from '../modules/users/schemas/schema';

export type UserRequestType = {
  id: string;
  name: string;
  username: string;
  mobile: string;
  email: string;
  password: string;
  avatar: string;
  isOrganizationOwner: boolean;
  status: string;
  refreshToken: string;
  lastLoginAt: Date;
  isVerified: boolean;
  isActive: boolean;
  is2FAEnabled: boolean;
  organizationId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Array<{ resource: string; action: string }>;
  isSuperAdmin?: boolean;
};
