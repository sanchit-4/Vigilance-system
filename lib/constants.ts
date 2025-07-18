// Application constants
export const APP_NAME = 'Vigilance';
export const APP_VERSION = '1.0.0';

// API endpoints
export const API_ENDPOINTS = {
  GUARDS: '/api/guards',
  CLIENTS: '/api/clients',
  LOCATIONS: '/api/locations',
  ATTENDANCE: '/api/attendance',
  INVENTORY: '/api/inventory',
  ADVANCES: '/api/advances',
} as const;

// Default values
export const DEFAULT_GEOFENCE_RADIUS = 100; // meters
export const DEFAULT_BASE_SALARY = 3000;
export const MAX_ATTENDANCE_RECORDS = 50;

// Status options
export const ATTENDANCE_STATUS = {
  PENDING: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;

export const INVENTORY_STATUS = {
  ISSUED: 'Issued',
  LOST: 'Lost',
  DAMAGED: 'Damaged',
  RETURNED: 'Returned',
} as const;

export const GUARD_CATEGORIES = {
  GUARD: 'Guard',
  GUNMAN: 'Gunman',
  SUPERVISOR: 'Supervisor',
  SECURITY_OFFICER: 'Security Officer',
  LADY_GUARD: 'Lady Guard',
} as const;

export const POLICE_VERIFICATION_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  GUARD: 'guard',
} as const;

// Time constants
export const REFRESH_INTERVAL = 30000; // 30 seconds
export const SESSION_TIMEOUT = 3600000; // 1 hour
export const GPS_TIMEOUT = 10000; // 10 seconds

// Validation rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_ADDRESS_LENGTH: 255,
  MIN_SALARY: 1000,
  MAX_SALARY: 100000,
  MIN_GEOFENCE_RADIUS: 10,
  MAX_GEOFENCE_RADIUS: 1000,
} as const;