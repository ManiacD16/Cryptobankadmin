import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Shield, Activity, Users, Eye, UserPlus, CheckCircle, XCircle, User } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// Move Modal component outside to prevent re-creation on every render
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const recentTransactions = [
    { id: 'TXN001', user: 'Alice Johnson', amount: '$1,250.00', status: 'completed', time: '2 min ago' },
    { id: 'TXN002', user: 'Bob Smith', amount: '$847.50', status: 'pending', time: '5 min ago' },
    { id: 'TXN003', user: 'Carol Davis', amount: '$2,100.00', status: 'completed', time: '8 min ago' },
    { id: 'TXN004', user: 'Dan Wilson', amount: '$675.25', status: 'failed', time: '12 min ago' },
    { id: 'TXN005', user: 'Eva Brown', amount: '$1,890.00', status: 'completed', time: '15 min ago' }
];

const Overview = () => {
    const [merchants, setMerchants] = useState([]);
    const [totalMerchants, setTotalMerchants] = useState(0);
    const [activeMerchants, setActiveMerchants] = useState(0);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedMerchantId, setSelectedMerchantId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Register form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        phoneNo: '',
        companyName: '',
        licenceNo: ''
    });

    const API_BASE_URL = 'https://79c08d872c31.ngrok-free.app/api/v1';

    // Dynamic stats based on actual data
    const stats = [
        {
            title: 'Total Merchants',
            value: totalMerchants.toLocaleString(),
            // change: '+12.5%',
            trend: 'up',
            icon: <Users className="w-6 h-6" />,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            title: 'Active Merchants',
            value: activeMerchants.toLocaleString(),
            // change: '+8.2%',
            trend: 'up',
            icon: <Shield className="w-6 h-6" />,
            color: 'from-purple-500 to-violet-500'
        },
        {
            title: 'Transactions Today',
            value: '8,942',
            // change: '+15.3%',
            trend: 'up',
            icon: <Activity className="w-6 h-6" />,
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Revenue',
            value: '$284,592',
            // change: '+23.1%',
            trend: 'up',
            icon: <DollarSign className="w-6 h-6" />,
            color: 'from-orange-500 to-amber-500'
        }
    ];

    useEffect(() => {
        fetchAllMerchants();
        fetchLatestMerchants();
    }, []);

    const fetchAllMerchants = async () => {
        try {
            // Fetch all merchants without pagination limit
            const response = await fetch(`${API_BASE_URL}/merchant?limit=10000`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.data) {
                const allMerchants = data.data;
                setTotalMerchants(allMerchants.length);

                // Count only approved merchants
                const approvedMerchants = allMerchants.filter(merchant => merchant.approved === 'approved');
                setActiveMerchants(approvedMerchants.length);
            }
        } catch (err) {
            console.error('Failed to fetch all merchants:', err);
        }
    };

    const fetchLatestMerchants = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/merchant?page=1&limit=10`, {
                credentials: 'include'
            });
            const data = await response.json();
            // Sort merchants by creation date (newest first)
            const sortedMerchants = (data.data || []).sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA;
            });
            setMerchants(sortedMerchants);
        } catch (err) {
            console.error('Failed to fetch merchants:', err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'approved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'failed':
            case 'blocked':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Registration failed');
                return;
            }

            setMessage('Merchant registered successfully');
            setFormData({
                name: '', email: '', password: '', confirmPassword: '',
                country: '', phoneNo: '', companyName: '', licenceNo: ''
            });
            setShowRegisterModal(false);
            // Refresh both merchant lists and stats
            fetchAllMerchants();
            fetchLatestMerchants();
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };
    const isRegisterDisabled = loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.country || !formData.phoneNo || !formData.companyName;

    const handleApproveMerchant = async () => {
        if (!selectedMerchantId) return;

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/admin/approve/${selectedMerchantId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Approval failed');
                return;
            }

            setMessage('Merchant approved successfully');
            setShowApproveModal(false);
            setSelectedMerchantId('');
            // Refresh both merchant lists and stats
            fetchAllMerchants();
            fetchLatestMerchants();
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleMerchantClick = (merchant) => {
        if (merchant.approved === 'pending') {
            setSelectedMerchantId(merchant._id);
            setShowApproveModal(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleCloseRegisterModal = () => {
        setShowRegisterModal(false);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setError('');
        setMessage('');
    };

    const handleCloseApproveModal = () => {
        setShowApproveModal(false);
        setSelectedMerchantId('');
        setError('');
        setMessage('');
    };

    return (
        <div className="space-y-8">
            {/* Alerts */}
            {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700 font-medium">{error}</span>
                    </div>
                </div>
            )}
            {message && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">{message}</span>
                    </div>
                </div>
            )}

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

                {/* Latest Merchants */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Latest Merchants</h2>
                        <button
                            onClick={() => setShowRegisterModal(true)}
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                        >
                            <UserPlus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {merchants.slice(0, 10).map((merchant) => (
                            <div
                                key={merchant._id}
                                className={`flex items-center justify-between p-4 bg-slate-100/50 rounded-xl border border-slate-200/50 hover:bg-slate-100/70 transition-all duration-300 ${merchant.approved === 'pending' ? 'cursor-pointer hover:shadow-md' : ''
                                    }`}
                                onClick={() => handleMerchantClick(merchant)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="text-slate-800 font-medium">{merchant.name}</div>
                                        <div className="text-slate-500 text-sm">{merchant.email}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(merchant.approved)}`}>
                                        {merchant.approved}
                                    </span>
                                    <div className="text-slate-500 text-xs mt-1">
                                        {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {merchants.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">No merchants found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Register Modal */}
            <Modal
                isOpen={showRegisterModal}
                onClose={handleCloseRegisterModal}
                title="Register New Merchant"
            >
                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <input
                            placeholder="Country"
                            value={formData.country}
                            name="country"
                            onChange={handleChange}
                            className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <PhoneInput
                            country={'in'}
                            value={formData.phoneNo}
                            onChange={phone => setFormData(prev => ({ ...prev, phoneNo: phone }))}
                            inputProps={{
                                name: 'phoneNo',
                                required: true,
                                autoFocus: false,
                                className: 'w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300'

                            }}
                        />
                    </div>
                    <div className="relative">
                        <input
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={handleChange}
                            name="companyName"
                            className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <input
                            placeholder="Licence Number(Optional)"
                            value={formData.licenceNo}
                            onChange={handleChange}
                            name="licenceNo"
                            className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                    <button
                        onClick={handleRegister}
                        disabled={isRegisterDisabled}
                        className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register Merchant'}
                    </button>
                </div>
            </Modal>

            {/* Approve Modal */}
            <Modal
                isOpen={showApproveModal}
                onClose={handleCloseApproveModal}
                title="Approve Merchant"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-800 text-sm">
                            Are you sure you want to approve this merchant?
                        </p>
                        <p className="text-yellow-600 text-xs mt-1">
                            Merchant ID: {selectedMerchantId}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleApproveMerchant}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                            onClick={handleCloseApproveModal}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Overview;