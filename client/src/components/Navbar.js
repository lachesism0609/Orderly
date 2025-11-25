import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { currentUser, logout, isMerchant } = useAuth();
    const { getCartItemsCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary-600">Orderly</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/restaurants" className="text-gray-700 hover:text-primary-600 transition-colors">
                            {t('nav.restaurants')}
                        </Link>

                        {currentUser ? (
                            <>
                                {isMerchant && (
                                    <Link to="/merchant/dashboard" className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
                                        {t('profile.merchantDashboard')}
                                    </Link>
                                )}
                                <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    {t('nav.orders')}
                                </Link>
                                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
                                    {t('nav.cart')}
                                    {getCartItemsCount() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {getCartItemsCount()}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    {t('nav.profile')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-primary-600 transition-colors"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                                >
                                    {t('nav.register')}
                                </Link>
                            </>
                        )}

                        {/* Language Switcher */}
                        <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-3 py-1 rounded-md transition-colors ${i18n.language === 'en'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => changeLanguage('zh')}
                                className={`px-3 py-1 rounded-md transition-colors ${i18n.language === 'zh'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                中文
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            <Link
                                to="/restaurants"
                                className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('nav.restaurants')}
                            </Link>
                            {currentUser ? (
                                <>
                                    {isMerchant && (
                                        <Link
                                            to="/merchant/dashboard"
                                            className="block px-3 py-2 text-orange-600 font-medium hover:text-orange-700"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {t('profile.merchantDashboard')}
                                        </Link>
                                    )}
                                    <Link
                                        to="/orders"
                                        className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('nav.orders')}
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('nav.cart')} ({getCartItemsCount()})
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('nav.profile')}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                                    >
                                        {t('nav.logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('nav.login')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 text-primary-600 hover:text-primary-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t('nav.register')}
                                    </Link>
                                </>
                            )}

                            {/* Mobile Language Switcher */}
                            <div className="flex items-center space-x-2 px-3 py-2 border-t mt-2">
                                <span className="text-gray-600 text-sm">Language:</span>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`px-3 py-1 rounded-md text-sm transition-colors ${i18n.language === 'en'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => changeLanguage('zh')}
                                    className={`px-3 py-1 rounded-md text-sm transition-colors ${i18n.language === 'zh'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    中文
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;