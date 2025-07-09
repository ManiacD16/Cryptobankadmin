import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, BarChart3, ChevronLeft } from 'lucide-react';
import Overview from './Pages/Overview';
import Manage from './Pages/Manage';
import Transactions from './Pages/Transactions';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tabHistory, setTabHistory] = useState([]);
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'manage', label: 'Manage', icon: <Users className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard className="w-4 h-4" /> },
  ];

  // Tab switch logic to manage tab history
  const handleTabSwitch = (tab) => {
    if (tab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab(tab);
    }
  };

  // Back button logic: first tab back, then browser back if no tab history
  const handleTabBack = () => {
    if (tabHistory.length > 0) {
      const previousTab = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, prev.length - 1));
      setActiveTab(previousTab);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 z-0">
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-slate-600 mt-2">Manage your platform with powerful administrative tools</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={handleTabBack}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-sm mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
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
