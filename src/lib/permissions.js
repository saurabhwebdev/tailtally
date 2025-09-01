/**
 * Role and Permission validation utilities
 */

// Define all available roles
export const ROLES = {
  ADMIN: 'admin',
  VETERINARIAN: 'veterinarian',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

// Define all available permissions
export const PERMISSIONS = {
  // Pet permissions
  READ_PETS: 'read_pets',
  WRITE_PETS: 'write_pets',
  DELETE_PETS: 'delete_pets',

  // User permissions
  READ_USERS: 'read_users',
  WRITE_USERS: 'write_users',
  DELETE_USERS: 'delete_users',

  // Owner permissions
  READ_OWNERS: 'read_owners',
  WRITE_OWNERS: 'write_owners',
  DELETE_OWNERS: 'delete_owners',

  // Appointment permissions
  READ_APPOINTMENTS: 'read_appointments',
  WRITE_APPOINTMENTS: 'write_appointments',
  DELETE_APPOINTMENTS: 'delete_appointments',

  // Medical records permissions
  READ_MEDICAL_RECORDS: 'read_medical_records',
  WRITE_MEDICAL_RECORDS: 'write_medical_records',
  DELETE_MEDICAL_RECORDS: 'delete_medical_records',

  // Inventory permissions
  READ_INVENTORY: 'read_inventory',
  WRITE_INVENTORY: 'write_inventory',
  DELETE_INVENTORY: 'delete_inventory',
  MANAGE_STOCK: 'manage_stock',

  // Sales permissions
  READ_SALES: 'read_sales',
  WRITE_SALES: 'write_sales',
  DELETE_SALES: 'delete_sales',
  PROCESS_PAYMENTS: 'process_payments',

  // Invoice permissions
  READ_INVOICES: 'read_invoices',
  WRITE_INVOICES: 'write_invoices',
  DELETE_INVOICES: 'delete_invoices',

  // Notification permissions
  MANAGE_NOTIFICATIONS: 'manage_notifications',
  SEND_NOTIFICATIONS: 'send_notifications',

  // System permissions
  MANAGE_SYSTEM: 'manage_system',
  VIEW_REPORTS: 'view_reports',
  MANAGE_BILLING: 'manage_billing',
  ACCESS_ADMIN: 'access_admin'
};

// Role hierarchy (higher roles inherit lower role permissions)
export const ROLE_HIERARCHY = {
  [ROLES.CUSTOMER]: [],
  [ROLES.STAFF]: [ROLES.CUSTOMER],
  [ROLES.VETERINARIAN]: [ROLES.CUSTOMER],
  [ROLES.ADMIN]: [ROLES.CUSTOMER, ROLES.STAFF, ROLES.VETERINARIAN]
};

// Default permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.READ_PETS,
    PERMISSIONS.WRITE_PETS,
    PERMISSIONS.DELETE_PETS,
    PERMISSIONS.READ_USERS,
    PERMISSIONS.WRITE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.READ_OWNERS,
    PERMISSIONS.WRITE_OWNERS,
    PERMISSIONS.DELETE_OWNERS,
    PERMISSIONS.READ_APPOINTMENTS,
    PERMISSIONS.WRITE_APPOINTMENTS,
    PERMISSIONS.DELETE_APPOINTMENTS,
    PERMISSIONS.READ_MEDICAL_RECORDS,
    PERMISSIONS.WRITE_MEDICAL_RECORDS,
    PERMISSIONS.DELETE_MEDICAL_RECORDS,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.WRITE_INVENTORY,
    PERMISSIONS.DELETE_INVENTORY,
    PERMISSIONS.MANAGE_STOCK,
    PERMISSIONS.READ_SALES,
    PERMISSIONS.WRITE_SALES,
    PERMISSIONS.DELETE_SALES,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.READ_INVOICES,
    PERMISSIONS.WRITE_INVOICES,
    PERMISSIONS.DELETE_INVOICES,
    PERMISSIONS.MANAGE_NOTIFICATIONS,
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.MANAGE_SYSTEM,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.ACCESS_ADMIN
  ],
  [ROLES.VETERINARIAN]: [
    PERMISSIONS.READ_PETS,
    PERMISSIONS.WRITE_PETS,
    PERMISSIONS.READ_OWNERS,
    PERMISSIONS.WRITE_OWNERS,
    PERMISSIONS.READ_APPOINTMENTS,
    PERMISSIONS.WRITE_APPOINTMENTS,
    PERMISSIONS.DELETE_APPOINTMENTS,
    PERMISSIONS.READ_MEDICAL_RECORDS,
    PERMISSIONS.WRITE_MEDICAL_RECORDS,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.WRITE_INVENTORY,
    PERMISSIONS.READ_SALES,
    PERMISSIONS.WRITE_SALES,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.READ_INVOICES,
    PERMISSIONS.WRITE_INVOICES,
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_BILLING
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.READ_PETS,
    PERMISSIONS.WRITE_PETS,
    PERMISSIONS.READ_OWNERS,
    PERMISSIONS.WRITE_OWNERS,
    PERMISSIONS.READ_APPOINTMENTS,
    PERMISSIONS.WRITE_APPOINTMENTS,
    PERMISSIONS.READ_MEDICAL_RECORDS,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.WRITE_INVENTORY,
    PERMISSIONS.MANAGE_STOCK,
    PERMISSIONS.READ_SALES,
    PERMISSIONS.WRITE_SALES,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.READ_INVOICES,
    PERMISSIONS.WRITE_INVOICES,
    PERMISSIONS.MANAGE_BILLING
  ],
  [ROLES.CUSTOMER]: [
    PERMISSIONS.READ_PETS,
    PERMISSIONS.READ_OWNERS,
    PERMISSIONS.READ_APPOINTMENTS
  ]
};

/**
 * Check if a role is valid
 */
export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

/**
 * Check if a permission is valid
 */
export function isValidPermission(permission) {
  return Object.values(PERMISSIONS).includes(permission);
}

/**
 * Get default permissions for a role
 */
export function getDefaultPermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has permission to perform an action
 */
export function roleHasPermission(role, permission) {
  const permissions = getDefaultPermissions(role);
  return permissions.includes(permission);
}

/**
 * Check if a user has permission (considering both role and custom permissions)
 */
export function userHasPermission(user, permission) {
  if (!user) return false;

  // Check custom permissions first
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }

  // Check role-based permissions
  return roleHasPermission(user.role, permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function userHasAnyPermission(user, permissions) {
  return permissions.some(permission => userHasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function userHasAllPermissions(user, permissions) {
  return permissions.every(permission => userHasPermission(user, permission));
}

/**
 * Check if a role has higher or equal priority than another role
 */
export function roleHasHigherOrEqualPriority(role1, role2) {
  const rolePriority = {
    [ROLES.CUSTOMER]: 1,
    [ROLES.STAFF]: 2,
    [ROLES.VETERINARIAN]: 3,
    [ROLES.ADMIN]: 4
  };

  return rolePriority[role1] >= rolePriority[role2];
}

/**
 * Check if a user can manage another user (based on role hierarchy)
 */
export function canManageUser(managerUser, targetUser) {
  if (!managerUser || !targetUser) return false;

  // Admins can manage everyone
  if (managerUser.role === ROLES.ADMIN) return true;

  // Users cannot manage users with equal or higher roles
  return roleHasHigherOrEqualPriority(managerUser.role, targetUser.role) &&
    managerUser.role !== targetUser.role;
}

/**
 * Get all roles that a user can assign to others
 */
export function getAssignableRoles(user) {
  if (!user) return [];

  const allRoles = Object.values(ROLES);

  if (user.role === ROLES.ADMIN) {
    return allRoles; // Admins can assign any role
  }

  // Other roles cannot assign roles
  return [];
}

/**
 * Validate role assignment
 */
export function canAssignRole(assignerUser, targetRole) {
  const assignableRoles = getAssignableRoles(assignerUser);
  return assignableRoles.includes(targetRole);
}

/**
 * Get user capabilities based on role and permissions
 */
export function getUserCapabilities(user) {
  if (!user) return { permissions: [], canManageUsers: false, canViewReports: false };

  const permissions = user.permissions || getDefaultPermissions(user.role);

  return {
    permissions,
    canManageUsers: user.role === ROLES.ADMIN,
    canViewReports: userHasPermission(user, PERMISSIONS.VIEW_REPORTS),
    canManageSystem: userHasPermission(user, PERMISSIONS.MANAGE_SYSTEM),
    canManageBilling: userHasPermission(user, PERMISSIONS.MANAGE_BILLING),
    canDeleteRecords: userHasAnyPermission(user, [
      PERMISSIONS.DELETE_PETS,
      PERMISSIONS.DELETE_USERS,
      PERMISSIONS.DELETE_APPOINTMENTS,
      PERMISSIONS.DELETE_MEDICAL_RECORDS
    ]),
    assignableRoles: getAssignableRoles(user)
  };
}

/**
 * Resource access control helpers
 */
export const ACCESS_CONTROL = {
  /**
   * Check if user can access their own resource
   */
  canAccessOwnResource(user, resourceUserId) {
    return user && user._id && user._id.toString() === resourceUserId.toString();
  },

  /**
   * Check if user can access any resource (staff+)
   */
  canAccessAnyResource(user) {
    return userHasAnyPermission(user, [
      PERMISSIONS.READ_PETS,
      PERMISSIONS.READ_APPOINTMENTS,
      PERMISSIONS.READ_MEDICAL_RECORDS
    ]) && [ROLES.ADMIN, ROLES.VETERINARIAN, ROLES.STAFF].includes(user.role);
  },

  /**
   * Check if user can access specific resource (own or staff+)
   */
  canAccessResource(user, resourceUserId) {
    return this.canAccessOwnResource(user, resourceUserId) || this.canAccessAnyResource(user);
  }
};

/**
 * Permission validators for specific features
 */
export const FEATURE_PERMISSIONS = {
  pets: {
    read: [PERMISSIONS.READ_PETS],
    create: [PERMISSIONS.WRITE_PETS],
    update: [PERMISSIONS.WRITE_PETS],
    delete: [PERMISSIONS.DELETE_PETS]
  },
  owners: {
    read: [PERMISSIONS.READ_OWNERS],
    create: [PERMISSIONS.WRITE_OWNERS],
    update: [PERMISSIONS.WRITE_OWNERS],
    delete: [PERMISSIONS.DELETE_OWNERS]
  },
  appointments: {
    read: [PERMISSIONS.READ_APPOINTMENTS],
    create: [PERMISSIONS.WRITE_APPOINTMENTS],
    update: [PERMISSIONS.WRITE_APPOINTMENTS],
    delete: [PERMISSIONS.DELETE_APPOINTMENTS]
  },
  medicalRecords: {
    read: [PERMISSIONS.READ_MEDICAL_RECORDS],
    create: [PERMISSIONS.WRITE_MEDICAL_RECORDS],
    update: [PERMISSIONS.WRITE_MEDICAL_RECORDS],
    delete: [PERMISSIONS.DELETE_MEDICAL_RECORDS]
  },
  inventory: {
    read: [PERMISSIONS.READ_INVENTORY],
    create: [PERMISSIONS.WRITE_INVENTORY],
    update: [PERMISSIONS.WRITE_INVENTORY],
    delete: [PERMISSIONS.DELETE_INVENTORY],
    manage: [PERMISSIONS.MANAGE_STOCK]
  },
  sales: {
    read: [PERMISSIONS.READ_SALES],
    create: [PERMISSIONS.WRITE_SALES],
    update: [PERMISSIONS.WRITE_SALES],
    delete: [PERMISSIONS.DELETE_SALES],
    payment: [PERMISSIONS.PROCESS_PAYMENTS]
  },
  invoices: {
    read: [PERMISSIONS.READ_INVOICES],
    create: [PERMISSIONS.WRITE_INVOICES],
    update: [PERMISSIONS.WRITE_INVOICES],
    delete: [PERMISSIONS.DELETE_INVOICES]
  },
  users: {
    read: [PERMISSIONS.READ_USERS],
    create: [PERMISSIONS.WRITE_USERS],
    update: [PERMISSIONS.WRITE_USERS],
    delete: [PERMISSIONS.DELETE_USERS]
  },
  notifications: {
    manage: [PERMISSIONS.MANAGE_NOTIFICATIONS],
    send: [PERMISSIONS.SEND_NOTIFICATIONS]
  },
  system: {
    manage: [PERMISSIONS.MANAGE_SYSTEM],
    reports: [PERMISSIONS.VIEW_REPORTS],
    billing: [PERMISSIONS.MANAGE_BILLING],
    admin: [PERMISSIONS.ACCESS_ADMIN]
  }
};
