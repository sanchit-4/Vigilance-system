import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Database } from '../../types/supabase';
import { ReportingEngine, ReportFilters } from './ReportingEngine';
import { Spinner } from '../shared/Spinner';
import { exportToExcel, exportToPdf } from './Exports';

type Guard = Database['public']['Tables']['guards']['Row'];
type SalaryAdvance = Database['public']['Tables']['salary_advances']['Row'];
type AssignedInventory = Database['public']['Tables']['assigned_inventory']['Row'] & {
  inventory_items: { item_name: string; value: number } | null;
};

type GuardSalaryStatement = {
  guard: Guard;
  advances: SalaryAdvance[];
  deductions: AssignedInventory[];
  totalAdvances: number;
  totalDeductions: number;
  netSalary: number;
};

export const SalaryReport: React.FC = () => {
  const [salaryStatements, setSalaryStatements] = useState<GuardSalaryStatement[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSalaryData = async (filters: ReportFilters) => {
    setLoading(true);
    try {
      // First, fetch all guards or a specific guard
      let guardsQuery = supabase.from('guards').select('*').eq('is_active', true);
      if (filters.guardId) {
        guardsQuery = guardsQuery.eq('id', filters.guardId);
      }
      const { data: guards, error: guardsError } = await guardsQuery;

      if (guardsError) throw guardsError;
      if (!guards || guards.length === 0) {
        setSalaryStatements([]);
        return;
      }

      // Process each guard
      const statements: GuardSalaryStatement[] = [];

      for (const guard of guards) {
        // Get advances for this guard within the date range
        const { data: advances, error: advancesError } = await supabase
          .from('salary_advances')
          .select('*')
          .eq('guard_id', guard.id)
          .gte('advance_date', filters.startDate)
          .lte('advance_date', filters.endDate)
          .eq('is_fully_recovered', false);

        if (advancesError) throw advancesError;

        // Get inventory deductions (lost/damaged items)
        const { data: deductions, error: deductionsError } = await supabase
          .from('assigned_inventory')
          .select('*, inventory_items(item_name, value)')
          .eq('guard_id', guard.id)
          .in('status', ['Lost', 'Damaged'])
          .gte('assigned_date', filters.startDate)
          .lte('assigned_date', filters.endDate);

        if (deductionsError) throw deductionsError;

        // Calculate totals
        const totalAdvances = (advances || []).reduce((sum, adv) => sum + adv.recovery_amount_per_period, 0);
        const totalDeductions = (deductions || []).reduce((sum, ded) => sum + (ded.inventory_items?.value || 0), 0);
        const netSalary = guard.base_salary - totalAdvances - totalDeductions;

        statements.push({
          guard,
          advances: advances || [],
          deductions: deductions as AssignedInventory[] || [],
          totalAdvances,
          totalDeductions,
          netSalary
        });
      }

      setSalaryStatements(statements);
    } catch (error) {
      console.error('Error fetching salary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (filters: ReportFilters, type: 'pdf' | 'excel') => {
    const title = 'Guard Salary Report';
    const filename = `salary_report_${filters.startDate}_to_${filters.endDate}`;
    
    const exportData = salaryStatements.map(statement => ({
      'Guard Name': statement.guard.name,
      'Category': statement.guard.category,
      'Base Salary': statement.guard.base_salary,
      'Advances': statement.totalAdvances,
      'Deductions': statement.totalDeductions,
      'Net Salary': statement.netSalary
    }));
    
    if (type === 'excel') {
      exportToExcel(exportData, filename, title);
    } else {
      exportToPdf(exportData, filename, title, filters);
    }
  };

  return (
    <ReportingEngine
      title="Salary Statement Report"
      description="Generate salary statements with deductions and advances"
      onExport={handleExport}
    >
      {(filters, isLoading) => {
        if (!loading && !salaryStatements.length) {
          // Fetch data when filters are applied
          fetchSalaryData(filters);
        }
        
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : salaryStatements.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guard</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advances</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salaryStatements.map(statement => (
                        <tr key={statement.guard.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{statement.guard.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{statement.guard.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${statement.guard.base_salary.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-${statement.totalAdvances.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-${statement.totalDeductions.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">${statement.netSalary.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {salaryStatements.map(statement => (
                    <div key={statement.guard.id} className="bg-white border rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-primary mb-4">{statement.guard.name}</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <span className="font-medium text-gray-600">Base Salary:</span>
                          <span className="text-right">${statement.guard.base_salary.toLocaleString()}</span>
                        </div>
                        
                        <hr />
                        
                        <h4 className="font-semibold text-gray-700">Deductions (Lost/Damaged Items)</h4>
                        {statement.deductions.length > 0 ? (
                          statement.deductions.map((deduction, index) => (
                            <div key={index} className="grid grid-cols-2 gap-x-4 text-sm">
                              <span className="text-gray-600">
                                {deduction.inventory_items?.item_name} ({deduction.status})
                              </span>
                              <span className="text-right text-red-600">
                                -${deduction.inventory_items?.value.toLocaleString() || 0}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">None</p>
                        )}
                        
                        <h4 className="font-semibold text-gray-700">Pending Advances</h4>
                        {statement.advances.length > 0 ? (
                          statement.advances.map((advance, index) => (
                            <div key={index} className="grid grid-cols-2 gap-x-4 text-sm">
                              <span className="text-gray-600">
                                Advance ({new Date(advance.advance_date).toLocaleDateString()})
                              </span>
                              <span className="text-right text-red-600">
                                -${advance.recovery_amount_per_period.toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">None</p>
                        )}
                        
                        <hr />
                        
                        <div className="grid grid-cols-2 gap-x-4 font-bold text-lg">
                          <span className="text-gray-800">Net Payable:</span>
                          <span className="text-right text-green-600">
                            ${statement.netSalary.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No salary data found for the selected criteria.
              </div>
            )}
          </div>
        );
      }}
    </ReportingEngine>
  );
};
