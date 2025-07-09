
import { Guard, Location, InventoryItem } from './types';

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
