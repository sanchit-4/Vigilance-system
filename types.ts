export enum View {
    DASHBOARD = 'DASHBOARD',
    CLIENTS = 'CLIENTS',
    GUARDS = 'GUARDS',
    LOCATIONS = 'LOCATIONS',
    ATTENDANCE = 'ATTENDANCE',
    FINANCIALS = 'FINANCIALS',
    REPORTS = 'REPORTS',
}

// These types are for the now-unused useVigilanceSystem hook and constants.
// They are kept here to resolve compilation errors in those files.
export interface Guard {
    id: string;
    name: string;
    contactInfo: string;
    baseSalary: number;
    locationIds: string[];
}

export interface Location {
    id:string;
    siteName: string;
    latitude: number;
    longitude: number;
    geofenceRadius: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    value: number;
}

export interface AttendanceRecord {
    id: string;
    guardId: string;
    locationId: string;
    checkInTime: Date;
    verified: boolean;
}

export interface AssignedItem {
    id: string;
    guardId: string;
    itemId: string;
    assignedDate: Date;
    status: 'assigned' | 'lost' | 'damaged' | 'returned';
}

export interface SalaryAdvance {
    id: string;
    guardId: string;
    amount: number;
    date: Date;
    repaid: boolean;
}

export interface Deduction {
    id: string;
    guardId: string;
    description: string;
    amount: number;
    date: Date;
}