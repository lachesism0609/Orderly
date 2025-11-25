import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { t } = useTranslation();
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        <span className="text-primary-600">{t('home.title')}</span>
                        <br />
                        <span className="text-3xl md:text-4xl">{t('home.subtitle')}</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        {t('home.welcome')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/restaurants"
                            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                        >
                            {t('home.browseRestaurants')}
                        </Link>
                        {!currentUser && (
                            <Link
                                to="/register"
                                className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
                            >
                                {t('home.signUpNow')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {t('home.whyChoose')}
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {t('home.whyDescription')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('home.quickOrdering')}</h3>
                            <p className="text-gray-600">
                                {t('home.quickOrderingDesc')}
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('home.reviewSystem')}</h3>
                            <p className="text-gray-600">
                                {t('home.reviewSystemDesc')}
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t('home.safeSec')}</h3>
                            <p className="text-gray-600">
                                {t('home.safeSecDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-primary-600 py-16">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        {t('home.readyToOrder')}
                    </h2>
                    <p className="text-primary-100 text-lg mb-8">
                        {t('home.joinThousands')}
                    </p>
                    <Link
                        to="/restaurants"
                        className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg inline-block"
                    >
                        {t('home.getStarted')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;