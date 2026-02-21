export enum PermissionResource {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  ORGANIZATIONS = 'organizations',
  SUBSCRIPTION_PLANS = 'subscription_plans',
  USER_ROLES = 'user_roles',
  ROLE_PERMISSIONS = 'role_permissions',
  ORGANIZATION_MODULES = 'organization_modules',
  MODULES = 'modules',
  ORGANIZATION_FEATURE_FLAGS = 'organization_feature_flags',
  FEATURE_FLAGS = 'feature_flags',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export',
  IMPORT = 'import',
}

export const PREDEFINED_PERMISSIONS: ReadonlyArray<{
  resource: PermissionResource;
  action: PermissionAction;
}> = (() => {
  const resources = Object.values(PermissionResource);
  const actions = Object.values(PermissionAction);
  return resources.flatMap((resource) => actions.map((action) => ({ resource, action })));
})();
