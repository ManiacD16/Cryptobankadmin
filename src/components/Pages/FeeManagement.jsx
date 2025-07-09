import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';


const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const FeeManagement = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [editingFee, setEditingFee] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const navigate = useNavigate();


    // Form state
    const [formData, setFormData] = useState({
        feeType: 'percentage',
        value: 0
    });

    // Fetch all fees
    const fetchFees = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/fee?page=${page}&limit=${limit}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setFees(data.data);
                if (data.pagination) {
                    setTotalPages(data.pagination.pages);
                }
            } else {
                throw new Error('Failed to fetch fees');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch fees');
        } finally {
            setLoading(false);
        }
    };


    // Create new fee
    const createFee = async () => {
        try {
            setError(null);
            const response = await fetch(`${API_BASE_URL}/fee`, {
                method: 'POST',
                credentials: 'include', // ADD THIS LINE
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                await fetchFees(currentPage);
                setShowForm(false);
                setFormData({ feeType: 'percentage', value: 0 });
            } else {
                throw new Error(result.message || 'Failed to create fee');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create fee');
            console.error('Error creating fee:', err);
        }
    };


    // Update fee
    const updateFee = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fee/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    ...getAuthHeaders()
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchFees(currentPage);
            setEditingFee(null);
            setFormData({ feeType: 'percentage', value: 0 });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update fee');
        }
    };


    // Delete fee
    const deleteFee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this fee setting?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/fee/${id}`, {
                method: 'DELETE',
                credentials: 'include', // ADD THIS
                headers: {
                    ...getAuthHeaders(),   // For Authorization if required
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchFees(currentPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete fee');
        }
    };


    // Get single fee by ID
    const getFeeById = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fee/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch fee details');
            return null;
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFee) {
            updateFee(editingFee._id);
        } else {
            createFee();
        }
    };

    // Handle edit - fetch current data first
    const handleEdit = async (fee) => {
        try {
            setError(null);
            // Fetch the latest data for this fee
            const response = await fetch(`${API_BASE_URL}/fee/${fee._id}`, {
                method: 'GET',
                credentials: 'include',         // Add this
                headers: getAuthHeaders()       // Already correct
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setEditingFee(data.data);
                setFormData({
                    feeType: data.data.feeType,
                    value: data.data.value
                });
                setShowForm(true);
            } else {
                throw new Error(data.message || 'Failed to fetch fee for editing');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch fee for editing');
            console.error('Error fetching fee for edit:', err);
        }
    };


    // Handle cancel
    const handleCancel = () => {
        setShowForm(false);
        setShowDetailsModal(false);
        setEditingFee(null);
        setSelectedFee(null);
        setFormData({ feeType: 'percentage', value: 0 });
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchFees(page);
    };

    useEffect(() => {
        fetchFees();
    }, []);

    return (
        <div className="p-8">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
                    <p className="text-slate-600 mt-1">
                        Configure all fee-related settings for the platform
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Fee
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Fee Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editingFee ? 'Edit Fee Setting' : 'Add New Fee Setting'}
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fee Type
                                </label>
                                <select
                                    value={formData.feeType}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        feeType: e.target.value
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Value {formData.feeType === 'percentage' ? '(%)' : '($)'}
                                </label>
                                <input
  type="number"
  value={formData.value}
  onChange={(e) =>
    setFormData({
      ...formData,
      value: e.target.value   // Don't parse here, just store as string!
    })
  }
  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
  min="0"
  step={formData.feeType === 'percentage' ? '0.01' : '0.01'}
/>

                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                                >
                                    <Save size={16} />
                                    {editingFee ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Fee Settings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fee Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Value
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : fees.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        No fee settings found
                                    </td>
                                </tr>
                            ) : (
                                fees.map((fee) => (
                                    <tr key={fee._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fee.feeType === 'percentage'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {fee.feeType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {fee.feeType === 'percentage' ? `${fee.value}%` : `$${fee.value}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {fee.createdAt ? new Date(fee.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(fee)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteFee(fee._id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                            {/* Fee Details Modal */}
                            {showDetailsModal && selectedFee && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold">Fee Details</h2>
                                            <button
                                                onClick={handleCancel}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Fee ID
                                                </label>
                                                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border font-mono">
                                                    {selectedFee._id}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Fee Type
                                                </label>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedFee.feeType === 'percentage'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {selectedFee.feeType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                                                </span>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Value
                                                </label>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {selectedFee.feeType === 'percentage'
                                                        ? `${selectedFee.value}%`
                                                        : `${selectedFee.value}`}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Created At
                                                </label>
                                                <p className="text-sm text-gray-600">
                                                    {selectedFee.createdAt
                                                        ? new Date(selectedFee.createdAt).toLocaleString()
                                                        : 'N/A'}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Updated At
                                                </label>
                                                <p className="text-sm text-gray-600">
                                                    {selectedFee.updatedAt
                                                        ? new Date(selectedFee.updatedAt).toLocaleString()
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={() => {
                                                    setShowDetailsModal(false);
                                                    handleEdit(selectedFee);
                                                }}
                                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowDetailsModal(false);
                                                    deleteFee(selectedFee._id);
                                                }}
                                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeManagement;