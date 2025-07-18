export enum View {
    DASHBOARD = 'DASHBOARD',
    CLIENTS = 'CLIENTS',
    GUARDS = 'GUARDS',
    LOCATIONS = 'LOCATIONS',
    ATTENDANCE = 'ATTENDANCE',
    FINANCIALS = 'FINANCIALS',
    REPORTS = 'REPORTS',
}

export interface Guard {
    id: number;
    name: string;
    address?: string;
    date_of_birth?: string;
    date_of_joining: string;
    police_verification_status: 'Pending' | 'Verified' | 'Rejected';
    category: 'Guard' | 'Gunman' | 'Supervisor' | 'Security Officer' | 'Lady Guard';
    date_of_exit?: string;
    contact_info?: string;
    base_salary: number;
    is_active: boolean;
    role: 'admin' | 'supervisor' | 'guard';
    user_id?: string;
}

export interface Client {
    id: number;
    name: string;
    address?: string;
    phone_1?: string;
    phone_2?: string;
    created_at: string;
}

export interface Location {
    id: number;
    client_id: number;
    site_name: string;
    address?: string;
    latitude: number;
    longitude: number;
    geofence_radius_meters: number;
    created_at: string;
}

export interface AttendanceRecord {
    id: number;
    guard_id: number;
    location_id: number;
    check_in_time: string;
    is_within_geofence: boolean;
    status: 'Pending Approval' | 'Approved' | 'Rejected';
    confirmed_by_supervisor_id?: number;
    confirmation_timestamp?: string;
}

export interface InventoryItem {
    id: number;
    item_name: string;
    value: number;
}

export interface SalaryAdvance {
    id: number;
    guard_id: number;
    amount: number;
    advance_date: string;
    recovery_amount_per_period: number;
    is_fully_recovered: boolean;
}

export interface AssignedInventory {
    id: number;
    guard_id: number;
    item_id: number;
    assigned_date: string;
    status: 'Issued' | 'Lost' | 'Damaged' | 'Returned';
    notes?: string;
}

export interface GuardAssignment {
    id: number;
    guard_id: number;
    location_id: number;
    assignment_date: string;
}