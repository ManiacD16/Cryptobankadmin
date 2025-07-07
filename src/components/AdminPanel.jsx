import React, { useState } from 'react';
import { Users, CreditCard, BarChart3, Download } from 'lucide-react';
import Overview from './Pages/Overview';
import Manage from './Pages/Manage';
import Transactions from './Pages/Transactions';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'manage', label: 'Manage', icon: <Users className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-slate-600 mt-2">Manage your platform with powerful administrative tools</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-sm mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'manage' && <Manage />}
        {activeTab === 'transactions' && <Transactions />}
      </div>
    </div>
  );
};

export default AdminPanel;
