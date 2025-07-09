import React, { useState, useEffect, useCallback } from 'react';
import { Shield, UserPlus, CheckCircle, XCircle, Copy, User, CreditCard, Users, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CopyButton from "../Button/Copy";

// Move components outside to prevent recreation on each render
const TabButton = ({ id, icon: Icon, label, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${active
            ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/25'
            : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-slate-200'
            }`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
    </button>
);

const InputField = ({ type = 'text', placeholder, value, onChange, name, icon: Icon }) => (
    <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />}
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 bg-white`}
        />
    </div>
);

const Button = ({ onClick, children, variant = 'primary', disabled = false, icon: Icon }) => {
    const baseClasses = "flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:from-purple-600 hover:to-violet-600 hover:shadow-purple-500/25",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600 hover:shadow-green-500/25",
        danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:from-red-600 hover:to-pink-600 hover:shadow-red-500/25",
        outline: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{children}</span>
        </button>
    );
};

const ManageMerchant = () => {
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

    const [approveUserId, setApproveUserId] = useState('');
    const [blockUserId, setBlockUserId] = useState('');
    const [merchantId, setMerchantId] = useState('');
    const [merchantTransactions, setMerchantTransactions] = useState([]);
    const [merchantDetails, setMerchantDetails] = useState(null);
    const [merchants, setMerchants] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('register');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const [tabHistory, setTabHistory] = useState([]);



    const API_BASE_URL = 'http://localhost:5000/api/v1';

    useEffect(() => {
        fetchMerchants();
        // eslint-disable-next-line
    }, [pagination.page, pagination.limit, statusFilter, timeFilter]);

    const handleTabBack = () => {
  if (tabHistory.length > 0) {
    const previousTab = tabHistory[tabHistory.length - 1];
    setTabHistory((prev) => prev.slice(0, prev.length - 1));
    setActiveTab(previousTab);
  } else {
    window.history.back(); // Browser back
  }
};


    // Use useCallback to prevent function recreation
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setMessage('');
    }, []);

    const handleApproveUserIdChange = useCallback((e) => {
        setApproveUserId(e.target.value);
    }, []);

    const handleBlockUserIdChange = useCallback((e) => {
        setBlockUserId(e.target.value);
    }, []);

    const handleMerchantIdChange = useCallback((e) => {
        setMerchantId(e.target.value);
        // Clear previous details and transactions when merchant ID changes
        setMerchantDetails(null);
        setMerchantTransactions([]);
    }, []);

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords don't match");
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) return setError(data.message || 'Registration failed');
            setMessage('Merchant registered successfully');
            setFormData({
                name: '', email: '', password: '', confirmPassword: '',
                country: '', phoneNo: '', companyName: '', licenceNo: ''
            });
            fetchMerchants();
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };
    const isRegisterDisabled = loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.country || !formData.phoneNo || !formData.companyName;

    const handleApproveMerchant = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/approve/${approveUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) return setError(data.message || 'Approval failed');
            setMessage(`Merchant ${approveUserId} approved successfully`);
            setApproveUserId('');
            fetchMerchants();
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockMerchant = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/block/${blockUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) return setError(data.message || 'Block failed');
            setMessage(`Merchant ${blockUserId} blocked successfully`);
            setBlockUserId('');
            fetchMerchants();
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMerchants = async () => {
        try {
            let params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
            });

            // Only add if filter/search is not default/empty
            if (search.trim()) params.append('search', search.trim());
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (timeFilter !== 'all') params.append('time', timeFilter);

            const res = await fetch(`${API_BASE_URL}/merchant?${params.toString()}`, {
                credentials: 'include'
            });
            const data = await res.json();
            setMerchants(data.data || []);
            setPagination(prev => ({
                ...prev,
                total: data.total || 0,
                totalPages: data.totalPages || 1,
            }));

        } catch (err) {
            setError('Failed to fetch merchants');
        }
    };
    const shortDisplay = (str, start = 6, end = 4) => {
        if (!str) return '-';
        if (str.length <= start + end + 3) return str;
        return `${str.slice(0, start)}...${str.slice(-end)}`;
    };

const handleTabSwitch = useCallback(
  (tab) => {
    if (tab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab(tab);
    }
  },
  [activeTab]
);


    const fetchMerchantDetails = async () => {
        if (!merchantId.trim()) {
            setError('Please enter a merchant ID');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/merchant/${merchantId}`, {
                credentials: 'include'
            });
            const response = await res.json();
            if (!res.ok) {
                setError(response.message || 'Failed to fetch merchant details');
                setMerchantDetails(null);
                return;
            }
            // Access the nested data property from the API response
            setMerchantDetails(response.data);
            setMessage('Merchant details fetched successfully');
        } catch (err) {
            setError('Failed to fetch merchant details');
            setMerchantDetails(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchMerchantTransactions = async () => {
        if (!merchantId.trim()) {
            setError('Please enter a merchant ID');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/merchant/${merchantId}/transactions?page=1&limit=10`, {
                credentials: 'include'
            });
            const response = await res.json();
            if (!res.ok) {
                setError(response.message || 'Failed to fetch merchant transactions');
                setMerchantTransactions([]);
                return;
            }
            // Handle both possible response structures
            const transactions = response.data?.transactions || response.transactions || [];
            setMerchantTransactions(transactions);
            setMessage('Merchant transactions fetched successfully');
        } catch (err) {
            setError('Failed to fetch transactions');
            setMerchantTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const DetailItem = ({ label, value }) => (
        <div>
            <p className="text-slate-500">{label}</p>
            <p className="font-medium text-slate-800">{value || '-'}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Shield className="w-10 h-10 text-purple-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Merchant Management</h1>
                    </div>
                    <p className="text-slate-600 text-lg">Manage merchant accounts, verify documents, and handle approvals</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </div>
                    </div>
                )}
                {message && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-green-700 font-medium">{message}</span>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center">
                    <TabButton
                        id="register"
                        icon={UserPlus}
                        label="Register"
                        active={activeTab === 'register'}
                        onClick={handleTabSwitch}
                    />
                    <TabButton
                        id="approve"
                        icon={CheckCircle}
                        label="Approve/Block"
                        active={activeTab === 'approve'}
                        onClick={handleTabSwitch}
                    />
                    <TabButton
                        id="details"
                        icon={Eye}
                        label="View Details"
                        active={activeTab === 'details'}
                        onClick={handleTabSwitch}
                    />
                    <TabButton
                        id="list"
                        icon={Users}
                        label="All Merchants"
                        active={activeTab === 'list'}
                        onClick={handleTabSwitch}
                    />
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    <Button
      onClick={handleTabBack}
      variant="outline"
      icon={ChevronLeft}
      className="mr-3"
    >
      Back
    </Button>
                    {activeTab === 'register' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <UserPlus className="w-6 h-6 text-purple-500" />
                                <h2 className="text-2xl font-bold text-slate-800">Register New Merchant</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    name="name"
                                    icon={User}
                                />
                                <InputField
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    name="email"
                                />
                                <InputField
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    name="password"
                                />
                                <InputField
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    name="confirmPassword"
                                />
                                <InputField
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    name="country"
                                />
                                <PhoneInput
                                    country={'in'}
                                    value={formData.phoneNo}
                                    onChange={phone => setFormData(prev => ({ ...prev, phoneNo: phone }))}
                                    inputProps={{
                                        name: 'phoneNo',
                                        required: true,
                                        autoFocus: false,
                                        className: 'rounded-xl border border-slate-200 px-4 py-3 bg-white w-full'
                                    }}
                                />
                                <InputField
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    name="companyName"
                                />
                                <InputField
                                    placeholder="Licence Number(Optional)"
                                    value={formData.licenceNo}
                                    onChange={handleChange}
                                    name="licenceNo"
                                />

                            </div>
                            <div className="mt-6">
                                <Button onClick={handleRegister} icon={UserPlus} disabled={isRegisterDisabled}>
                                    {loading ? 'Registering...' : 'Register Merchant'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'approve' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <h2 className="text-2xl font-bold text-slate-800">Approve Merchant</h2>
                                </div>
                                <div className="space-y-4">
                                    <InputField
                                        placeholder="Enter User ID to Approve"
                                        value={approveUserId}
                                        onChange={handleApproveUserIdChange}
                                    />
                                    <Button onClick={handleApproveMerchant} variant="success" icon={CheckCircle} disabled={loading}>
                                        {loading ? 'Approving...' : 'Approve Merchant'}
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <XCircle className="w-6 h-6 text-red-500" />
                                    <h2 className="text-2xl font-bold text-slate-800">Block Merchant</h2>
                                </div>
                                <div className="space-y-4">
                                    <InputField
                                        placeholder="Enter User ID to Block"
                                        value={blockUserId}
                                        onChange={handleBlockUserIdChange}
                                    />
                                    <Button onClick={handleBlockMerchant} variant="danger" icon={XCircle} disabled={loading}>
                                        {loading ? 'Blocking...' : 'Block Merchant'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <Eye className="w-6 h-6 text-blue-500" />
                                <h2 className="text-2xl font-bold text-slate-800">Merchant Details & Transactions</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <InputField
                                            placeholder="Enter Merchant ID"
                                            value={merchantId}
                                            onChange={handleMerchantIdChange}
                                            icon={Search}
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button onClick={fetchMerchantDetails} variant="outline" icon={User} disabled={loading || !merchantId.trim()}>
                                            {loading ? 'Loading...' : 'Get Details'}
                                        </Button>
                                        <Button onClick={fetchMerchantTransactions} variant="outline" icon={CreditCard} disabled={loading || !merchantId.trim()}>
                                            {loading ? 'Loading...' : 'Get Transactions'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Display merchant details if available */}
                                {merchantDetails && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Merchant Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <DetailItem label="Merchant ID" value={merchantDetails._id} />
                                            <DetailItem label="Name" value={merchantDetails.name} />
                                            <DetailItem label="Email" value={merchantDetails.email} />
                                            <DetailItem label="Role" value={merchantDetails.role} />
                                            <div>
                                                <p className="text-slate-500">Status</p>
                                                <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full
    ${merchantDetails.approved === 'approved' ? 'bg-green-100 text-green-800'
                                                        : merchantDetails.approved === 'blocked' ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'}
  `}>
                                                    {merchantDetails.approved || 'pending'}
                                                </span>
                                            </div>

                                            <DetailItem label="Total Amount" value={`$${merchantDetails.totalAmt || 0}`} />
                                            <DetailItem label="Wallet Address" value={merchantDetails.walletAddress} />
                                            <DetailItem label="API Key" value={merchantDetails.apiKey} />
                                            <DetailItem label="Secret Key" value={merchantDetails.apiSecret} />

                                            <DetailItem
                                                label="Created At"
                                                value={merchantDetails.createdAt ? new Date(merchantDetails.createdAt).toLocaleString() : '-'}
                                            />
                                            <DetailItem
                                                label="Updated At"
                                                value={merchantDetails.updatedAt ? new Date(merchantDetails.updatedAt).toLocaleString() : '-'}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Display merchant transactions if available */}
                                {merchantTransactions.length > 0 && (
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-purple-200">
                                                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Transaction ID</th>
                                                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Amount</th>
                                                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Status</th>
                                                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {merchantTransactions.map((transaction, index) => (
                                                        <tr key={index} className="border-b border-purple-100">
                                                            <td className="py-2 px-3 text-sm text-slate-600">{transaction.id || transaction._id}</td>
                                                            <td className="py-2 px-3 text-sm text-slate-600">${transaction.amount || '-'}</td>
                                                            <td className="py-2 px-3 text-sm">
                                                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {transaction.status || 'pending'}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 px-3 text-sm text-slate-600">
                                                                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Show message when no data is available */}
                                {!merchantDetails && !merchantTransactions.length && merchantId && (
                                    <div className="text-center py-8">
                                        <Eye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500">Enter a merchant ID and click "Get Details" or "Get Transactions" to view information</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'list' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Users className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-bold text-slate-800">All Merchants</h2>
                                </div>
                                <span className="text-sm text-slate-500">Page {pagination.page}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by Name, Email, Company, Phone"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-slate-200 w-64"
                                />

                                {/* Status Filter */}
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-slate-200"
                                >
                                    <option value="all">All Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="blocked">Blocked</option>
                                </select>

                                {/* Time Filter */}
                                <select
                                    value={timeFilter}
                                    onChange={e => setTimeFilter(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-slate-200"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="last7">Last 7 Days</option>
                                    <option value="last30">Last 30 Days</option>
                                </select>

                                <Button
                                    onClick={() => {
                                        setPagination({ ...pagination, page: 1 }); // Go to first page on search
                                        fetchMerchants();
                                    }}
                                    icon={Search}
                                    variant="outline"
                                >
                                    Search
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">ID</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Company</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Phone No.</th>

                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Wallet</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">API Key</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {merchants.map((merchant) => (
                                            <tr key={merchant._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-600 flex items-center">
                                                    {shortDisplay(merchant._id)}
                                                    <CopyButton value={merchant._id} />
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium text-slate-800">{merchant.name}</td>
                                                <td className="py-3 px-4 text-sm text-slate-600">{merchant.email}</td>
                                                <td className="py-3 px-4 text-sm text-slate-600">{merchant.companyName || '-'}</td>
                                                <td className="py-3 px-4 text-sm text-slate-600">{merchant.phoneNo || '-'}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${merchant.approved === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : merchant.approved === 'blocked'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {merchant.approved}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-600">{shortDisplay(merchant.walletAddress || '-')}</td>
                                                <td className="py-3 px-4 text-xs font-mono text-slate-500 flex items-center">
                                                    {merchant.apiKey ? shortDisplay(merchant.apiKey) : '-'}
                                                    {merchant.apiKey && <CopyButton value={merchant.apiKey} />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {merchants.length === 0 && (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">No merchants found</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-6">
                                <Button
                                    onClick={() =>
                                        setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })
                                    }
                                    variant="outline"
                                    icon={ChevronLeft}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                    variant="outline"
                                    icon={ChevronRight}
                                    disabled={
                                        !pagination.totalPages || pagination.page >= pagination.totalPages
                                    }
                                >
                                    Next
                                </Button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageMerchant;