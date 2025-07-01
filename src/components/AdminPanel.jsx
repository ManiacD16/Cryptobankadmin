import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  // Settings, 
  Activity, 
  Eye, 
  UserPlus, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Filter,
  Search,
  MoreVertical,
  Download
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'manage', label: 'Manage', icon: <Users className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard className="w-4 h-4" /> },
    // { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const stats = [
    {
      title: 'Total Merchants',
      value: '12,845',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Active Merchants',
      value: '2,341',
      change: '+8.2%',
      trend: 'up',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Transactions Today',
      value: '8,942',
      change: '+15.3%',
      trend: 'up',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Revenue',
      value: '$284,592',
      change: '+23.1%',
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const recentTransactions = [
    { id: 'TXN001',  amount: '$1,250.00', status: 'completed', time: '2 min ago' },
    { id: 'TXN002',  amount: '$847.50', status: 'pending', time: '5 min ago' },
    { id: 'TXN003',  amount: '$2,100.00', status: 'completed', time: '8 min ago' },
    { id: 'TXN004', amount: '$675.25', status: 'failed', time: '12 min ago' },
    { id: 'TXN005', amount: '$1,890.00', status: 'completed', time: '15 min ago' }
  ];

  const recentUsers = [
    { id: 'USR001', email: 'alice@example.com', status: 'active', joined: '2 hours ago' },
    { id: 'USR002',  email: 'bob@example.com', status: 'pending', joined: '4 hours ago' },
    { id: 'USR003',  email: 'carol@example.com', status: 'active', joined: '6 hours ago' },
    { id: 'USR004', email: 'dan@example.com', status: 'inactive', joined: '8 hours ago' },
    { id: 'USR002',  email: 'bob@example.com', status: 'pending', joined: '4 hours ago' },

  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed':
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Animation */}
      <div className="fixed inset-0 bg-gradient-to-r from-blue-100/30 via-indigo-100/30 to-purple-100/30 animate-pulse -z-10"></div>
      
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your platform with powerful administrative tools
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 p-1 bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-sm">
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
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="relative group p-6 bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                      <div className="text-green-600 text-sm font-medium">{stat.change}</div>
                    </div>
                  </div>
                  <h3 className="text-slate-600 font-medium">{stat.title}</h3>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-100/50 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
                  <button className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-slate-100/50 rounded-xl border border-slate-200/50 hover:bg-slate-100/70 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-slate-800 font-medium">{transaction.user}</div>
                          <div className="text-slate-500 text-sm">{transaction.id}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-800 font-bold">{transaction.amount}</div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                          <span className="text-slate-500 text-xs">{transaction.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">New Merchants</h2>
                  <button className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-slate-100/50 rounded-xl border border-slate-200/50 hover:bg-slate-100/70 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="text-slate-800 font-medium">{user.name}</div>
                          <div className="text-slate-500 text-sm">{user.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <div className="text-slate-500 text-xs mt-1">{user.joined}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
              <button className="px-6 py-3 bg-white/70 backdrop-blur-lg border border-slate-200/50 rounded-xl text-slate-700 hover:bg-white/90 transition-all duration-300 flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div> */}

            {/* User Management Content */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Merchant Management</h2>
              <div className="grid grid-cols-1  gap-6">
                {/* <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-8 h-8 text-blue-500" />
                    <h3 className="text-xl font-bold text-slate-800">Manage Users</h3>
                  </div>
                  <p className="text-slate-600 mb-4">View, edit, and manage all user accounts and permissions.</p>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                    Access User Management
                  </button>
                </div> */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200/50">
                  <div className="flex items-center justify-center space-x-3 w-full mb-4 ">
                    <Shield className="w-8 h-8 text-purple-500" />
                    <h3 className="text-xl font-bold text-slate-800">Merchant Panel</h3>
                  </div>
                  <p className="text-slate-600 mb-4 text-center">Manage merchant accounts, verify documents, and handle approvals.</p>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                    Manage Merchant
                  </button>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                  <div className="flex items-center justify-center space-x-3 w-full mb-4 ">
                    <Activity className="w-8 h-8 text-blue-500" />
                    <h3 className="text-xl font-bold text-slate-800">API Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4 text-center">Configure API endpoints and integration settings.</p>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                    Manage API
                  </button>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200/50">
                  <div className="flex items-center justify-center space-x-3 w-full mb-4 ">
                    <DollarSign className="w-8 h-8 text-red-500" />
                    <h3 className="text-xl font-bold text-slate-800">Fees Management</h3>
                  </div>
                  <p className="text-slate-600 mb-4 text-center">Manage fees.</p>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                    Manage Fees
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Transaction Monitoring</h2>
              <div className="grid grid-cols-1  gap-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-green-500" />
                    <h3 className="text-xl font-bold text-slate-800">View Transactions</h3>
                  </div>
                  <p className="text-slate-600 mb-4 text-center">Monitor all platform transactions in real-time with advanced filtering.</p>
                  <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                    View All Transactions
                  </button>
                </div>
                {/* <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                    <h3 className="text-xl font-bold text-slate-800">Fraud Detection</h3>
                  </div>
                  <p className="text-slate-600 mb-4">Review flagged transactions and manage security alerts.</p>
                  <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/25">
                    Review Alerts
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;