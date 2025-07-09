// components/Manage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, DollarSign } from 'lucide-react';

const Manage = () => {
    // inside your AdminPanel component
const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200/50">
        <div className="flex items-center justify-center space-x-3 w-full mb-4 ">
          <Shield className="w-8 h-8 text-purple-500" />
          <h3 className="text-xl font-bold text-slate-800">Merchant Panel</h3>
        </div>
        <p className="text-slate-600 mb-4 text-center">Manage merchant accounts, verify documents, and handle approvals.</p>
        <button  onClick={() => navigate('/manage')} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
          Manage Merchant
        </button>
      </div>

      {/* <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
        <div className="flex items-center justify-center space-x-3 w-full mb-4 ">
          <Activity className="w-8 h-8 text-blue-500" />
          <h3 className="text-xl font-bold text-slate-800">API Management</h3>
        </div>
        <p className="text-slate-600 mb-4 text-center">Configure API endpoints and integration settings.</p>
        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
          Manage API
        </button>
      </div> */}

      <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200/50">
        <div className="flex items-center justify-center space-x-3 w-full mb-4 ">
          <DollarSign className="w-8 h-8 text-red-500" />
          <h3 className="text-xl font-bold text-slate-800">Fees Management</h3>
        </div>
        <p className="text-slate-600 mb-4 text-center">Manage fees.</p>
        <button
        onClick={() => navigate('/fees')} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
          Manage Fees
        </button>
      </div>
    </div>
  );
};

export default Manage;
