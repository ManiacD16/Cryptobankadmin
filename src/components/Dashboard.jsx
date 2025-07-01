import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wallet, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Filter,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const [balance, setBalance] = useState(200.00);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Simulate real-time balance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const transactions = [
    { id: 1, type: 'Incoming', amount: 50.00, status: 'confirmed', time: '2 mins ago', hash: '0x1a2b3c...' },
    { id: 2, type: 'Outgoing', amount: 25.50, status: 'pending', time: '5 mins ago', hash: '0x4d5e6f...' },
    { id: 3, type: 'Incoming', amount: 75.25, status: 'confirmed', time: '1 hour ago', hash: '0x7g8h9i...' },
    { id: 4, type: 'Outgoing', amount: 100.00, status: 'confirmed', time: '3 hours ago', hash: '0xjk1l2m...' },
  ];

  const stats = [
    { label: 'Today\'s Volume', value: '1,234.56', change: '+12.3%', trend: 'up' },
    { label: 'Success Rate', value: '98.7%', change: '+0.2%', trend: 'up' },
    { label: 'Avg. Transaction', value: '45.67', change: '-2.1%', trend: 'down' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
              Merchant Dashboard
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Monitor your crypto payments and track performance in real-time
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <button
              onClick={refreshData}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-blue-500/25"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-6 hover:bg-white/90 transition-all duration-300 group shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                  <p className="text-sm text-gray-600">Recent payment activities</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === 'Incoming' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.type === 'Incoming' ? (
                          <ArrowDownRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-800 font-medium">{tx.type}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-gray-500 text-sm">{tx.hash}</span>
                          <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        tx.type === 'Incoming' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'Incoming' ? '+' : '-'}{tx.amount} USDT
                      </div>
                      <div className="text-sm text-gray-500">{tx.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 transition-colors duration-200">
              View All Transactions
            </button>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          
          {/* Real-time Balance */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-lg border border-blue-200 rounded-xl p-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Real-time Balance</h3>
                    <p className="text-sm text-blue-700">Live wallet status</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 text-sm">USDT Balance</span>
                    <span className="text-xs text-blue-600">Updated now</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {balance.toFixed(2)} <span className="text-lg text-blue-700">USDT</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-blue-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Available</span>
                    <span className="text-gray-800 font-medium">{(balance * 0.95).toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-blue-700">Pending</span>
                    <span className="text-yellow-600 font-medium">{(balance * 0.05).toFixed(2)} USDT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Overview */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-lg border border-green-200 rounded-xl p-6 relative overflow-hidden shadow-lg">
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-200/50 to-emerald-200/50 rounded-full blur-xl"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Earnings Overview</h3>
                  <p className="text-sm text-green-700">Total performance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    150.00 <span className="text-lg text-green-700">USDT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">+8.5% from last week</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                  <div>
                    <div className="text-green-700 text-xs mb-1">This Week</div>
                    <div className="text-gray-800 font-semibold">45.60 USDT</div>
                  </div>
                  <div>
                    <div className="text-green-700 text-xs mb-1">This Month</div>
                    <div className="text-gray-800 font-semibold">150.00 USDT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                Generate Payment Link
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-gray-300">
                Download Report
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-gray-300">
                API Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;