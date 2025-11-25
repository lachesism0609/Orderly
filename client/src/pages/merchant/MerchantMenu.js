import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function MerchantMenu() {
    const { t } = useTranslation();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        available: true
    });

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await api.get('/merchant/menu');
            // Ensure response.data is an array, or default to empty array
            setMenuItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setMenuItems([]); // Set to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/merchant/menu/${editingItem.id}`, formData);
            } else {
                await api.post('/merchant/menu', formData);
            }
            await fetchMenuItems();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving menu item:', error);
            alert(t('merchant.menu.saveFailed'));
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category || '',
            image: item.image || item.imageUrl || '',
            available: item.available !== false
        });
        setShowModal(true);
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm(t('merchant.menu.deleteConfirm'))) return;

        try {
            await api.delete(`/merchant/menu/${itemId}`);
            await fetchMenuItems();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert(t('merchant.menu.deleteFailed'));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            available: true
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('merchant.menu.title')}</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {t('merchant.menu.addItem')}
                    </button>
                </div>

                {menuItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">{t('merchant.menu.noItems')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                {(item.image || item.imageUrl) && (
                                    <img
                                        src={item.image || item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                )}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.available ? t('merchant.menu.available') : t('merchant.menu.unavailable')}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-orange-500 font-bold text-xl">¥{item.price}</span>
                                        <span className="text-gray-500 text-sm">{item.category}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 添加/编辑菜品模态框 */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {editingItem ? t('merchant.menu.editItem') : t('merchant.menu.addItemTitle')}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('merchant.menu.form.name')} *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('merchant.menu.form.description')}
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('merchant.menu.form.price')} *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('merchant.menu.form.category')} *
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            placeholder={t('merchant.menu.form.categoryPlaceholder')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('merchant.menu.form.imageUrl')}
                                        </label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="available"
                                            checked={formData.available}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-700">
                                            {t('merchant.menu.form.available')}
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        {editingItem ? t('common.save') : t('common.add')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MerchantMenu;
