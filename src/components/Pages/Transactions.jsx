// components/Transactions.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const Transactions = () => {
  return (
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
  );
};

export default Transactions;
