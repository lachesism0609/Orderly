import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: currentUser?.displayName || '',
        phoneNumber: currentUser?.phoneNumber || '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update profile logic here
            alert(t('profile.profileUpdated'));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(t('profile.updateFailed'));
        }
    };

    const handleCancel = () => {
        setFormData({
            displayName: currentUser?.displayName || '',
            phoneNumber: currentUser?.phoneNumber || '',
            address: ''
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {t('profile.title')}
            </h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                            {currentUser?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">
                                {formData.displayName || currentUser?.email}
                            </h2>
                            <p className="text-primary-100">
                                {t('profile.memberSince')} {new Date(currentUser?.metadata?.creationTime || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 text-left">
                            {t('profile.personalInfo')}
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                            >
                                {t('profile.editProfile')}
                            </button>
                        ) : (
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {t('profile.cancelEdit')}
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Display Name */}
                        <div className="text-left">
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                {t('profile.displayName')}
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-left"
                                />
                            ) : (
                                <p className="text-gray-900 text-left">
                                    {formData.displayName || t('profile.notSet')}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="text-left">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                {t('profile.email')}
                            </label>
                            <div className="flex items-center space-x-2">
                                <p className="text-gray-900 text-left">{currentUser?.email}</p>
                                {currentUser?.emailVerified && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        {t('profile.verified')}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm mt-1 text-left">
                                {t('profile.emailCannotChange')}
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div className="text-left">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                {t('profile.phoneNumber')}
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-left"
                                />
                            ) : (
                                <p className="text-gray-900 text-left">
                                    {formData.phoneNumber || t('profile.notSet')}
                                </p>
                            )}
                        </div>

                        {/* Delivery Address */}
                        <div className="text-left">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                {t('profile.deliveryAddress')}
                            </label>
                            {isEditing ? (
                                <textarea
                                    id="address"
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-left"
                                />
                            ) : (
                                <p className="text-gray-900 text-left">
                                    {formData.address || t('profile.notSet')}
                                </p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                                >
                                    {t('profile.save')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    {t('profile.cancel')}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 text-left">
                        {t('profile.accountSettings')}
                    </h3>

                    <div className="space-y-4">
                        {/* Email Verification */}
                        <div className="flex items-center justify-between py-3 border-b">
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900 text-left">
                                    {t('profile.emailVerification')}
                                </h4>
                                <p className="text-gray-600 text-sm text-left">
                                    {currentUser?.emailVerified ? t('profile.verified') : t('profile.notVerified')}
                                </p>
                            </div>
                            {!currentUser?.emailVerified && (
                                <button className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium">
                                    {t('profile.sendVerification')}
                                </button>
                            )}
                        </div>

                        {/* Change Password */}
                        <div className="flex items-center justify-between py-3 border-b">
                            <div className="text-left">
                                <h4 className="font-medium text-gray-900 text-left">
                                    {t('profile.changePassword')}
                                </h4>
                                <p className="text-gray-600 text-sm text-left">
                                    {t('profile.updatePassword')}
                                </p>
                            </div>
                            <button className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium">
                                {t('profile.change')}
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between py-3">
                            <div className="text-left">
                                <h4 className="font-medium text-red-600 text-left">
                                    {t('profile.deleteAccount')}
                                </h4>
                                <p className="text-gray-600 text-sm text-left">
                                    {t('profile.deleteAccountDesc')}
                                </p>
                            </div>
                            <button className="px-4 py-2 text-red-600 hover:text-red-700 font-medium">
                                {t('profile.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;