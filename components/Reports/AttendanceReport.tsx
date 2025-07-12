import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../types/supabase';
import { ReportingEngine, ReportFilters } from './ReportingEngine';
import { Spinner } from '../shared/Spinner';
import { exportToExcel, exportToPdf } from './Exports';

type AttendanceRecord = Database['public']['Tables']['attendance']['Row'] & {
  guards: { name: string; category: string } | null;
  locations: { site_name: string; clients: { name: string } | null } | null;
};

type GuardAttendanceSummary = {
  guardId: number;
  guardName: string;
  category: string;
  totalDays: number;
  approved: number;
  rejected: number;
  pending: number;
  records: AttendanceRecord[];
};

export const AttendanceReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [guardSummaries, setGuardSummaries] = useState<GuardAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendanceData = async (filters: ReportFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          guards (name, category),
          locations (site_name, clients (name))
        `)
        .gte('check_in_time', `${filters.startDate}T00:00:00`)
        .lte('check_in_time', `${filters.endDate}T23:59:59`)
        .order('check_in_time', { ascending: false });

      // Apply optional filters
      if (filters.guardId) {
        query = query.eq('guard_id', filters.guardId);
      }
      if (filters.locationId) {
        query = query.eq('location_id', filters.locationId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setAttendanceData(data as AttendanceRecord[]);
      processAttendanceData(data as AttendanceRecord[]);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAttendanceData = (records: AttendanceRecord[]) => {
    // Group records by guard
    const guardMap = new Map<number, AttendanceRecord[]>();
    
    for (const record of records) {
      if (!guardMap.has(record.guard_id)) {
        guardMap.set(record.guard_id, []);
      }
      guardMap.get(record.guard_id)?.push(record);
    }
    
    // Create summaries
    const summaries: GuardAttendanceSummary[] = [];
    
    for (const [guardId, guardRecords] of guardMap.entries()) {
      const guardName = guardRecords[0].guards?.name || 'Unknown';
      const category = guardRecords[0].guards?.category || 'Unknown';
      
      const approved = guardRecords.filter(r => r.status === 'Approved').length;
      const rejected = guardRecords.filter(r => r.status === 'Rejected').length;
      const pending = guardRecords.filter(r => r.status === 'Pending Approval').length;
      
      summaries.push({
        guardId,
        guardName,
        category,
        totalDays: approved, // Only count approved records as duty days
        approved,
        rejected,
        pending,
        records: guardRecords
      });
    }
    
    // Sort by guard name
    summaries.sort((a, b) => a.guardName.localeCompare(b.guardName));
    setGuardSummaries(summaries);
  };

  const handleExport = (filters: ReportFilters, type: 'pdf' | 'excel') => {
    const title = 'Guard Attendance Report';
    const filename = `attendance_report_${filters.startDate}_to_${filters.endDate}`;
    
    const exportData = guardSummaries.map(summary => ({
      'Guard Name': summary.guardName,
      'Category': summary.category,
      'Total Duty Days': summary.totalDays,
      'Approved Check-ins': summary.approved,
      'Rejected Check-ins': summary.rejected,
      'Pending Check-ins': summary.pending
    }));
    
    if (type === 'excel') {
      exportToExcel(exportData, filename, title);
    } else {
      exportToPdf(exportData, filename, title, filters);
    }
  };

  return (
    <ReportingEngine
      title="Attendance Report"
      description="View guard attendance records and duty day totals"
      onExport={handleExport}
    >
      {(filters, isLoading) => {
        if (!loading && !attendanceData.length) {
          // Fetch data when filters are applied
          fetchAttendanceData(filters);
        }
        
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : guardSummaries.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guard</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Duty Days</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejected</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {guardSummaries.map(summary => (
                        <tr key={summary.guardId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{summary.guardName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{summary.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{summary.totalDays}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{summary.approved}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{summary.rejected}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{summary.pending}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <h3 className="text-lg font-semibold mt-8 mb-4">Detailed Records</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guard</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geofence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.guards?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.locations?.site_name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.locations?.clients?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.check_in_time).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.is_within_geofence ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {record.is_within_geofence ? 'Verified' : 'Out of Range'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              record.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No attendance records found for the selected criteria.
              </div>
            )}
          </div>
        );
      }}
    </ReportingEngine>
  );
};
