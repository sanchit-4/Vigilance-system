import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar } from 'lucide-react';

export const FinancialsView: React.FC = () => {
    const financialData = {
        totalRevenue: 45600,
        totalExpenses: 32400,
        netProfit: 13200,
        salaryAdvances: 5800,
    };

    const salaryAdvances = [
        { id: 1, guard: 'John Smith', amount: 1200, date: '2024-01-15', status: 'Active' },
        { id: 2, guard: 'Maria Garcia', amount: 800, date: '2024-01-10', status: 'Active' },
        { id: 3, guard: 'David Johnson', amount: 1500, date: '2024-01-08', status: 'Repaid' },
        { id: 4, guard: 'Sarah Wilson', amount: 2300, date: '2024-01-05', status: 'Active' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-yellow-100 text-yellow-800';
            case 'Repaid': return 'bg-green-100 text-green-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
                    <p className="text-gray-600">Track revenue, expenses, and salary advances</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Add Advance</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Financial Report</span>
                    </button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-green-500 p-3 rounded-lg">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                            <p className="text-2xl font-bold text-gray-900">${financialData.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-red-500 p-3 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                            <p className="text-2xl font-bold text-gray-900">${financialData.totalExpenses.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
                            <p className="text-2xl font-bold text-gray-900">${financialData.netProfit.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-yellow-500 p-3 rounded-lg">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Salary Advances</h3>
                            <p className="text-2xl font-bold text-gray-900">${financialData.salaryAdvances.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Salary Advances Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Salary Advances</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guard</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salaryAdvances.map((advance) => (
                                <tr key={advance.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{advance.guard}</div>
                                        <div className="text-sm text-gray-500">ID: {advance.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                                            ${advance.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {advance.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(advance.status)}`}>
                                            {advance.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {advance.status === 'Active' && (
                                                <button className="text-green-600 hover:text-green-900">
                                                    Mark as Repaid
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Monthly Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Monthly Overview</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">${financialData.totalRevenue.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Revenue This Month</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">${financialData.totalExpenses.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Expenses This Month</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)}%</div>
                            <div className="text-sm text-gray-500">Profit Margin</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};