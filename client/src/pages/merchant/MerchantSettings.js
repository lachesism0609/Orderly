import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function MerchantSettings() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: '',
        cuisineType: '',
        openingHours: '',
        deliveryFee: 0,
        minimumOrder: 0,
        image: ''
    });

    useEffect(() => {
        fetchRestaurantInfo();
    }, []);

    const fetchRestaurantInfo = async () => {
        try {
            const response = await api.get('/merchant/restaurant');
            if (response.data) {
                setFormData({
                    name: response.data.name || '',
                    description: response.data.description || '',
                    address: response.data.address || '',
                    phone: response.data.phone || '',
                    cuisineType: response.data.cuisineType || '',
                    openingHours: response.data.openingHours || '',
                    deliveryFee: response.data.deliveryFee || 0,
                    minimumOrder: response.data.minimumOrder || 0,
                    image: response.data.image || ''
                });
            }
        } catch (error) {
            console.error('Error fetching restaurant info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/merchant/restaurant', {
                ...formData,
                deliveryFee: parseFloat(formData.deliveryFee),
                minimumOrder: parseFloat(formData.minimumOrder)
            });
            alert(t('merchant.settings.success'));
        } catch (error) {
            console.error('Error updating restaurant settings:', error);
            alert(t('merchant.settings.error'));
        } finally {
            setSaving(false);
        }
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
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('merchant.settings.title')}</h1>
                    <p className="mt-2 text-gray-600">{t('merchant.settings.subtitle')}</p>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* 基本信息 */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('merchant.settings.basicInfo')}</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('merchant.settings.form.name')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('merchant.settings.form.description')}
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('merchant.settings.form.cuisine')}
                                    </label>
                                    <input
                                        type="text"
                                        name="cuisineType"
                                        value={formData.cuisineType}
                                        onChange={handleChange}
                                        placeholder={t('merchant.menu.form.categoryPlaceholder')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('merchant.settings.form.coverImage')}
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 联系信息 */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('merchant.settings.contactInfo')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('merchant.settings.form.phone')} *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('merchant.settings.form.address')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 运营设置 */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('merchant.settings.operationSettings')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('merchant.settings.form.hours')}
                                    </label>
                                    <input
                                        type="text"
                                        name="openingHours"
                                        value={formData.openingHours}
                                        onChange={handleChange}
                                        placeholder="09:00 - 22:00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('merchant.settings.form.deliveryFee')}
                                        </label>
                                        <input
                                            type="number"
                                            name="deliveryFee"
                                            value={formData.deliveryFee}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.5"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('merchant.settings.form.minOrder')}
                                        </label>
                                        <input
                                            type="number"
                                            name="minimumOrder"
                                            value={formData.minimumOrder}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className={`px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {saving ? t('merchant.settings.form.saving') : t('merchant.settings.form.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MerchantSettings;
