// components/Overview.tsx
import React from 'react';
import { CreditCard, DollarSign, Shield, Activity, Users, Eye, UserPlus } from 'lucide-react';

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

const Overview = () => {
    return (
        < div className="space-y-8">
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
                </div>
            ))}
            </div>
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
  );
};

export default Overview;
