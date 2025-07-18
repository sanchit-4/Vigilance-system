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

// Initial data for demonstration
export const INITIAL_GUARDS: Guard[] = [
    { id: 'g1', name: 'John Doe', contactInfo: '555-1234', baseSalary: 3000, locationIds: ['l1'] },
    { id: 'g2', name: 'Jane Smith', contactInfo: '555-5678', baseSalary: 3200, locationIds: ['l2', 'l3'] },
    { id: 'g3', name: 'Mike Ross', contactInfo: '555-8765', baseSalary: 2900, locationIds: ['l3'] },
];

export const INITIAL_LOCATIONS: Location[] = [
    { id: 'l1', siteName: 'Downtown Mall', latitude: 34.0522, longitude: -118.2437, geofenceRadius: 100 },
    { id: 'l2', siteName: 'Tech Park Tower', latitude: 34.0550, longitude: -118.2450, geofenceRadius: 100 },
    { id: 'l3', siteName: 'Riverside Warehouse', latitude: 34.0495, longitude: -118.2400, geofenceRadius: 100 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
    { id: 'i1', name: 'Flashlight', value: 25 },
    { id: 'i2', name: 'Two-Way Radio', value: 150 },
    { id: 'i3', name: 'Security Vest', value: 80 },
    { id: 'i4', name: 'Pepper Spray', value: 20 },
];

type Guard = {
    id: string;
    name: string;
    contactInfo: string;
    baseSalary: number;
    locationIds: string[];
};

type Location = {
    id: string;
    siteName: string;
    latitude: number;
    longitude: number;
    geofenceRadius: number;
};

type InventoryItem = {
    id: string;
    name: string;
    value: number;
};