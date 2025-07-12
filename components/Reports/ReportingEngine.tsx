import React, { useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../types/supabase';
import { Spinner } from '../shared/Spinner';
import { Button } from '../shared/Button';
import { Select } from '../shared/Select';
import { Input } from '../shared/Input';
import { Download } from 'lucide-react';

type Guard = Database['public']['Tables']['guards']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];

export interface ReportFilters {
  guardId: number | null;
  locationId: number | null;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

interface ReportingEngineProps {
  title: string;
  description?: string;
  children: (filters: ReportFilters, isLoading: boolean) => ReactNode;
  onExport?: (filters: ReportFilters, type: 'pdf' | 'excel') => void;
}

export const ReportingEngine: React.FC<ReportingEngineProps> = ({
  title,
  description,
  children,
  onExport
}) => {
  const [guards, setGuards] = useState<Guard[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);
  
  // Default date range: current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const [filters, setFilters] = useState<ReportFilters>({
    guardId: null,
    locationId: null,
    startDate: firstDay.toISOString().split('T')[0],
    endDate: lastDay.toISOString().split('T')[0]
  });

  // Fetch guard and location data for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        const [guardsResponse, locationsResponse] = await Promise.all([
          supabase.from('guards').select('id, name').order('name'),
          supabase.from('locations').select('id, site_name').order('site_name')
        ]);

        if (guardsResponse.data) setGuards(guardsResponse.data);
        if (locationsResponse.data) setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilterApplied(true);
  };

  const resetFilters = () => {
    setFilters({
      guardId: null,
      locationId: null,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    });
    setFilterApplied(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {onExport && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onExport(filters, 'pdf')}
              disabled={!filterApplied}
            >
              <Download size={16} className="mr-2" /> PDF
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onExport(filters, 'excel')}
              disabled={!filterApplied}
            >
              <Download size={16} className="mr-2" /> Excel
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guard</label>
            <Select 
              value={filters.guardId || ''} 
              onChange={e => handleFilterChange('guardId', e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Guards</option>
              {guards.map(guard => (
                <option key={guard.id} value={guard.id}>{guard.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <Select 
              value={filters.locationId || ''} 
              onChange={e => handleFilterChange('locationId', e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.site_name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Input 
              type="date" 
              value={filters.startDate} 
              onChange={e => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <Input 
              type="date" 
              value={filters.endDate} 
              onChange={e => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" size="sm" onClick={resetFilters}>Reset</Button>
          <Button size="sm" onClick={applyFilters}>Apply Filters</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          filterApplied ? children(filters, loading) : (
            <div className="text-center py-10 text-gray-500">
              <p>Apply filters to generate the report</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
