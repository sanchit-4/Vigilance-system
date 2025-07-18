import { useState } from 'react';
import { Guard, Location, AttendanceRecord, InventoryItem, AssignedItem, SalaryAdvance, Deduction } from '../types';
import { INITIAL_GUARDS, INITIAL_LOCATIONS, INITIAL_INVENTORY } from '../lib/constants';

export const useVigilanceSystem = () => {
    const [guards, setGuards] = useState<Guard[]>(INITIAL_GUARDS);
    const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
    const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([]);
    const [advances, setAdvances] = useState<SalaryAdvance[]>([]);
    const [deductions, setDeductions] = useState<Deduction[]>([]);

    // Guard Management
    const addGuard = (guard: Omit<Guard, 'id'>) => {
        setGuards(prev => [...prev, { ...guard, id: `g${Date.now()}` }]);
    };
    
    const updateGuard = (updatedGuard: Guard) => {
        setGuards(prev => prev.map(g => g.id === updatedGuard.id ? updatedGuard : g));
    };

    // Location Management
    const addLocation = (location: Omit<Location, 'id'>) => {
        setLocations(prev => [...prev, { ...location, id: `l${Date.now()}` }]);
    };
    
    const updateLocation = (updatedLocation: Location) => {
        setLocations(prev => prev.map(l => l.id === updatedLocation.id ? updatedLocation : l));
    };

    // Attendance Management
    const markAttendance = (guardId: string, locationId: string, verified: boolean) => {
        const newRecord: AttendanceRecord = {
            id: `a${Date.now()}`,
            guardId,
            locationId,
            checkInTime: new Date(),
            verified,
        };
        setAttendance(prev => [...prev, newRecord]);
        return newRecord;
    };

    // Financial Management
    const assignItem = (guardId: string, itemId: string) => {
        const newAssignment: AssignedItem = {
            id: `as${Date.now()}`,
            guardId,
            itemId,
            assignedDate: new Date(),
            status: 'assigned',
        };
        setAssignedItems(prev => [...prev, newAssignment]);
    };

    const updateAssignedItemStatus = (assignmentId: string, status: 'lost' | 'damaged' | 'returned') => {
        setAssignedItems(prev => prev.map(item => {
            if (item.id === assignmentId) {
                if (status === 'lost' || status === 'damaged') {
                    const inventoryItem = inventory.find(i => i.id === item.itemId);
                    if (inventoryItem) {
                        const newDeduction: Deduction = {
                            id: `d${Date.now()}`,
                            guardId: item.guardId,
                            description: `Item ${status}: ${inventoryItem.name}`,
                            amount: inventoryItem.value,
                            date: new Date(),
                        };
                        setDeductions(d => [...d, newDeduction]);
                    }
                }
                return { ...item, status };
            }
            return item;
        }));
    };
    
    const logAdvance = (guardId: string, amount: number) => {
        const newAdvance: SalaryAdvance = {
            id: `adv${Date.now()}`,
            guardId,
            amount,
            date: new Date(),
            repaid: false,
        };
        setAdvances(prev => [...prev, newAdvance]);
    };
    
    const getGuardDeductions = (guardId: string) => {
        return deductions.filter(d => d.guardId === guardId);
    };

    const getGuardAdvances = (guardId: string) => {
        return advances.filter(a => a.guardId === guardId && !a.repaid);
    };

    return {
        guards,
        locations,
        attendance,
        inventory,
        assignedItems,
        advances,
        deductions,
        addGuard,
        updateGuard,
        addLocation,
        updateLocation,
        markAttendance,
        assignItem,
        updateAssignedItemStatus,
        logAdvance,
        getGuardDeductions,
        getGuardAdvances,
    };
};