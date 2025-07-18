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
    id: string;
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

// Additional type definitions for better type safety
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    hasMore: boolean;
    page: number;
}

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface GeolocationData {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
}

export interface CameraState {
    isOpen: boolean;
    isCapturing: boolean;
    error: string | null;
    photoDataUrl: string | null;
}

export interface FormState<T> {
    data: T;
    errors: Record<string, string>;
    isSubmitting: boolean;
}