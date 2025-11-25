import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 翻译资源
const resources = {
    en: {
        translation: {
            // Navigation
            nav: {
                restaurants: 'Restaurants',
                menu: 'Menu',
                orders: 'Orders',
                cart: 'Cart',
                profile: 'Profile',
                login: 'Login',
                register: 'Register',
                logout: 'Logout'
            },
            // Home Page
            home: {
                title: 'Orderly',
                subtitle: 'Food Ordering Platform',
                welcome: 'Welcome to Orderly - Your ultimate food ordering experience. Browse restaurants, place orders, and enjoy convenient delivery.',
                browseRestaurants: 'Browse Restaurants',
                signUpNow: 'Sign Up Now',
                whyChoose: 'Why Choose Orderly',
                whyDescription: 'Experience the best food ordering platform with these amazing features',
                quickOrdering: 'Quick Ordering',
                quickOrderingDesc: 'Easy and fast food ordering process with just a few clicks',
                reviewSystem: 'Review System',
                reviewSystemDesc: 'Rate and review your meals to help others make better choices',
                safeSec: 'Safe & Secure',
                safeSecDesc: 'Secure authentication and safe payment processing',
                readyToOrder: 'Ready to Start Ordering?',
                joinThousands: 'Join thousands of satisfied customers who enjoy our delicious meals',
                getStarted: 'Get Started Now'
            },
            // Restaurants Page
            restaurants: {
                title: 'Our Restaurants',
                description: 'Discover amazing restaurants near you',
                viewMenu: 'View Menu',
                rating: 'Rating',
                reviews: 'reviews',
                cuisineType: 'Cuisine',
                deliveryTime: 'Delivery Time',
                minOrder: 'Min Order',
                noRestaurants: 'No restaurants available at the moment'
            },
            // Restaurant Detail
            restaurantDetail: {
                about: 'About',
                menu: 'Menu',
                reviews: 'Reviews',
                hours: 'Opening Hours',
                address: 'Address',
                phone: 'Phone',
                backToRestaurants: 'Back to Restaurants',
                ingredients: 'Ingredients',
                special: 'Special'
            },
            // Menu Page
            menu: {
                title: 'Our Menu',
                description: 'Discover our delicious selection of authentic dishes',
                all: 'All',
                appetizers: 'Appetizers',
                mainDishes: 'Main Dishes',
                soups: 'Soups',
                beverages: 'Beverages',
                addToCart: 'Add to Cart',
                outOfStock: 'Out of Stock',
                reviews: 'reviews',
                noItems: 'No items in this category'
            },
            // Cart Page
            cart: {
                title: 'Shopping Cart',
                empty: 'Your cart is empty',
                emptyDesc: "Looks like you haven't added any items to your cart yet",
                browseRestaurants: 'Browse Restaurants',
                perItem: 'per item',
                total: 'Total',
                clearCart: 'Clear Cart',
                checkout: 'Proceed to Checkout',
                checkoutSuccess: 'Checkout successful! Redirecting to orders...',
                loginRequired: 'Please login first',
                checkoutSoon: 'Checkout feature coming soon',
                loginToComplete: 'Login or Sign up to complete your order',
                youMightLike: 'You might also like',
                moreOptions: 'More delicious options based on your cart',
                viewMenu: 'View Menu'
            },
            // Orders Page
            orders: {
                title: 'My Orders',
                noOrders: 'No orders yet',
                noOrdersDesc: "You don't have any order history yet",
                orderNumber: 'Order',
                orderDate: 'Order Date',
                viewDetails: 'View Details',
                orderAgain: 'Order Again',
                writeReview: 'Write Review',
                reviewed: 'Reviewed',
                cancelOrder: 'Cancel Order',
                reviewModal: {
                    title: 'Write a Review',
                    rating: 'Rating',
                    comment: 'Comment',
                    placeholder: 'Share your experience...',
                    submit: 'Submit Review',
                    success: 'Review submitted successfully'
                },
                status: {
                    pending: 'Pending',
                    confirmed: 'Confirmed',
                    preparing: 'Preparing',
                    ready: 'Ready',
                    delivered: 'Delivered',
                    cancelled: 'Cancelled'
                }
            },
            // Profile Page
            profile: {
                title: 'Profile',
                memberSince: 'Member since',
                editProfile: 'Edit Profile',
                cancelEdit: 'Cancel Edit',
                personalInfo: 'Personal Information',
                displayName: 'Display Name',
                email: 'Email Address',
                emailCannotChange: 'Email cannot be changed',
                phoneNumber: 'Phone Number',
                deliveryAddress: 'Delivery Address',
                notSet: 'Not set',
                save: 'Save',
                cancel: 'Cancel',
                accountSettings: 'Account Settings',
                emailVerification: 'Email Verification',
                verified: 'Verified',
                notVerified: 'Not verified',
                sendVerification: 'Send verification',
                changePassword: 'Change Password',
                updatePassword: 'Update your account password',
                change: 'Change',
                deleteAccount: 'Delete Account',
                deleteAccountDesc: 'Permanently delete your account and data',
                delete: 'Delete',
                profileUpdated: 'Profile updated successfully',
                updateFailed: 'Update failed',
                merchantDashboard: 'Merchant Dashboard',
                goToMerchantDashboard: 'Go to Merchant Dashboard',
                manageMerchantAccount: 'Manage your restaurant, menu, and orders'
            },
            // Login Page
            login: {
                title: 'Sign in to your account',
                noAccount: "Don't have an account?",
                signUpNow: 'Sign up now',
                email: 'Email address',
                password: 'Password',
                rememberMe: 'Remember me',
                forgotPassword: 'Forgot password?',
                signIn: 'Sign in',
                signingIn: 'Signing in...',
                orContinue: 'Or continue with',
                agree: 'By signing in, you agree to our Terms of Service and Privacy Policy',
                fillAllFields: 'Please fill in all fields',
                loginFailed: 'Failed to login. Please check your credentials',
                enterEmail: 'Enter your email',
                enterPassword: 'Enter your password'
            },
            // Register Page
            register: {
                title: 'Create your account',
                haveAccount: 'Already have an account?',
                signInNow: 'Sign in now',
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email address',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                registerAsMerchant: 'Register as Merchant',
                agreeToTerms: 'I agree to the',
                termsOfService: 'Terms of Service',
                and: 'and',
                privacyPolicy: 'Privacy Policy',
                createAccount: 'Create account',
                creatingAccount: 'Creating account...',
                fillRequired: 'Please fill in all required fields',
                passwordMismatch: 'Passwords do not match',
                passwordLength: 'Password must be at least 6 characters',
                registrationFailed: 'Failed to create account. Please try again',
                atLeast6Chars: 'At least 6 characters',
                enterAgain: 'Enter password again'
            },
            // Common
            common: {
                loading: 'Loading...',
                processing: 'Processing...',
                error: 'Error',
                success: 'Success',
                edit: 'Edit',
                delete: 'Delete',
                save: 'Save',
                cancel: 'Cancel',
                close: 'Close',
                add: 'Add',
                confirm: 'Confirm',
                none: 'None',
                labelSeparator: ': '
            },
            // Merchant
            merchant: {
                route: {
                    accessDenied: 'Access Denied',
                    notMerchant: 'You do not have permission to access the merchant dashboard.',
                    backHome: 'Back to Home'
                },
                dashboard: {
                    title: 'Merchant Dashboard',
                    welcome: 'Welcome back, {{name}}',
                    totalOrders: 'Total Orders',
                    pendingOrders: 'Pending Orders',
                    totalRevenue: 'Total Revenue',
                    menuItems: 'Menu Items',
                    averageRating: 'Average Rating',
                    completedOrders: 'Completed Orders',
                    quickActions: 'Quick Actions',
                    manageOrders: 'Manage Orders',
                    manageMenu: 'Manage Menu',
                    viewReviews: 'View Reviews',
                    settings: 'Settings'
                },
                menu: {
                    title: 'Menu Management',
                    addItem: 'Add Item',
                    noItems: 'No menu items found. Add your first item!',
                    available: 'Available',
                    unavailable: 'Unavailable',
                    editItem: 'Edit Item',
                    addItemTitle: 'Add New Item',
                    saveFailed: 'Failed to save menu item',
                    deleteConfirm: 'Are you sure you want to delete this item?',
                    deleteFailed: 'Failed to delete menu item',
                    form: {
                        name: 'Item Name',
                        description: 'Description',
                        price: 'Price',
                        category: 'Category',
                        categoryPlaceholder: 'e.g., Appetizers, Main Course',
                        imageUrl: 'Image URL',
                        available: 'Available for order'
                    }
                },
                orders: {
                    title: 'Order Management',
                    refresh: 'Refresh',
                    allOrders: 'All Orders',
                    noOrders: 'No orders found',
                    customer: 'Customer',
                    orderTime: 'Order Time',
                    total: 'Total',
                    items: 'Items',
                    actions: {
                        viewDetails: 'View Details',
                        confirm: 'Confirm',
                        cancel: 'Cancel',
                        startPreparing: 'Start Preparing',
                        finishPreparing: 'Finish Preparing',
                        complete: 'Complete'
                    },
                    details: {
                        title: 'Order Details',
                        info: 'Order Information',
                        status: 'Status',
                        customerName: 'Customer Name',
                        phone: 'Phone Number',
                        notes: 'Notes',
                        products: 'Order Items',
                        quantity: 'Qty',
                        subtotal: 'Subtotal'
                    }
                },
                reviews: {
                    title: 'Customer Reviews',
                    noReviews: 'No reviews yet',
                    anonymous: 'Anonymous',
                    reply: 'Reply'
                },
                settings: {
                    title: 'Restaurant Settings',
                    subtitle: 'Manage your restaurant information and settings',
                    success: 'Settings saved successfully',
                    error: 'Failed to save settings',
                    basicInfo: 'Basic Information',
                    contactInfo: 'Contact Information',
                    operationSettings: 'Operation Settings',
                    form: {
                        name: 'Restaurant Name',
                        description: 'Description',
                        cuisine: 'Cuisine Type',
                        coverImage: 'Cover Image URL',
                        phone: 'Phone Number',
                        address: 'Address',
                        hours: 'Opening Hours',
                        deliveryFee: 'Delivery Fee',
                        minOrder: 'Minimum Order',
                        saving: 'Saving...',
                        save: 'Save Changes'
                    }
                }
            }
        }
    },
    zh: {
        translation: {
            // 导航
            nav: {
                restaurants: '商家',
                menu: '菜单',
                orders: '订单',
                cart: '购物车',
                profile: '个人资料',
                login: '登录',
                register: '注册',
                logout: '退出'
            },
            // 主页
            home: {
                title: 'Orderly',
                subtitle: '美食订餐平台',
                welcome: '欢迎来到Orderly - 您的终极美食订餐体验。浏览商家，下单订购，享受便捷配送。',
                browseRestaurants: '浏览商家',
                signUpNow: '立即注册',
                whyChoose: '为什么选择Orderly',
                whyDescription: '体验最佳的美食订餐平台及其精彩功能',
                quickOrdering: '快速订餐',
                quickOrderingDesc: '简单快捷的订餐流程，只需几次点击',
                reviewSystem: '评价系统',
                reviewSystemDesc: '对您的餐点进行评分和评价，帮助他人做出更好的选择',
                safeSec: '安全可靠',
                safeSecDesc: '安全的身份验证和支付处理',
                readyToOrder: '准备好开始订餐了吗？',
                joinThousands: '加入数千名享受美味佳肴的满意客户',
                getStarted: '立即开始'
            },
            // 商家页面
            restaurants: {
                title: '我们的商家',
                description: '发现您附近的优质餐厅',
                viewMenu: '查看菜单',
                rating: '评分',
                reviews: '评价',
                cuisineType: '菜系',
                deliveryTime: '配送时间',
                minOrder: '起送价',
                noRestaurants: '暂无商家'
            },
            // 餐厅详情
            restaurantDetail: {
                about: '关于',
                menu: '菜单',
                reviews: '评价',
                hours: '营业时间',
                address: '地址',
                phone: '电话',
                backToRestaurants: '返回餐厅列表',
                ingredients: '配料',
                special: '特色'
            },
            // 菜单页面
            menu: {
                title: '我们的菜单',
                description: '探索我们美味的正宗菜肴',
                all: '全部',
                appetizers: '开胃菜',
                mainDishes: '主菜',
                soups: '汤',
                beverages: '饮品',
                addToCart: '加入购物车',
                outOfStock: '暂时缺货',
                reviews: '评价',
                noItems: '该分类暂无菜品'
            },
            // 购物车页面
            cart: {
                title: '购物车',
                empty: '购物车为空',
                emptyDesc: '看起来您还没有添加任何商品到购物车',
                browseRestaurants: '浏览商家',
                perItem: '每份',
                total: '总计',
                clearCart: '清空购物车',
                checkout: '去结账',
                checkoutSuccess: '结账成功！正在跳转至订单页面...',
                loginRequired: '请先登录',
                checkoutSoon: '结账功能即将上线',
                loginToComplete: '登录或注册以完成订单',
                youMightLike: '推荐商品',
                moreOptions: '基于您的购物车推荐更多美味选择',
                viewMenu: '查看菜单'
            },
            // 订单页面
            orders: {
                title: '我的订单',
                noOrders: '暂无订单',
                noOrdersDesc: '您还没有任何订单记录',
                orderNumber: '订单号',
                orderDate: '下单时间',
                viewDetails: '查看详情',
                orderAgain: '再次订购',
                writeReview: '撰写评价',
                reviewed: '已评价',
                cancelOrder: '取消订单',
                reviewModal: {
                    title: '撰写评价',
                    rating: '评分',
                    comment: '评论',
                    placeholder: '分享您的用餐体验...',
                    submit: '提交评价',
                    success: '评价提交成功'
                },
                status: {
                    pending: '待确认',
                    confirmed: '已确认',
                    preparing: '制作中',
                    ready: '待取餐',
                    delivered: '已送达',
                    cancelled: '已取消'
                }
            },
            // 个人资料页面
            profile: {
                title: '个人资料',
                memberSince: '加入时间',
                editProfile: '编辑资料',
                cancelEdit: '取消编辑',
                personalInfo: '个人信息',
                displayName: '显示名称',
                email: '邮箱地址',
                emailCannotChange: '邮箱地址无法修改',
                phoneNumber: '电话号码',
                deliveryAddress: '配送地址',
                notSet: '未设置',
                save: '保存',
                cancel: '取消',
                accountSettings: '账户设置',
                emailVerification: '邮箱验证',
                verified: '已验证',
                notVerified: '未验证',
                sendVerification: '发送验证邮件',
                changePassword: '修改密码',
                updatePassword: '更新您的账户密码',
                change: '修改',
                deleteAccount: '删除账户',
                deleteAccountDesc: '永久删除您的账户和数据',
                delete: '删除',
                profileUpdated: '个人资料已更新',
                updateFailed: '更新失败',
                merchantDashboard: '商家后台',
                goToMerchantDashboard: '进入商家后台',
                manageMerchantAccount: '管理您的餐厅、菜单和订单'
            },
            // 登录页面
            login: {
                title: '登录账户',
                noAccount: '没有账户？',
                signUpNow: '立即注册',
                email: '邮箱地址',
                password: '密码',
                rememberMe: '记住我',
                forgotPassword: '忘记密码？',
                signIn: '登录',
                signingIn: '登录中...',
                orContinue: '或者',
                agree: '通过登录，您同意我们的服务条款和隐私政策',
                fillAllFields: '请填写所有字段',
                loginFailed: '登录失败，请检查您的凭据',
                enterEmail: '输入您的邮箱',
                enterPassword: '输入您的密码'
            },
            // 注册页面
            register: {
                title: '创建新账户',
                haveAccount: '已有账户？',
                signInNow: '立即登录',
                firstName: '名',
                lastName: '姓',
                email: '电子邮箱',
                password: '密码',
                confirmPassword: '确认密码',
                registerAsMerchant: '注册为商家',
                agreeToTerms: '我同意',
                termsOfService: '服务条款',
                and: '和',
                privacyPolicy: '隐私政策',
                createAccount: '创建账户',
                creatingAccount: '注册中...',
                fillRequired: '请填写所有必需字段',
                passwordMismatch: '密码不匹配',
                passwordLength: '密码至少需要6个字符',
                registrationFailed: '创建账户失败，请重试',
                atLeast6Chars: '至少6个字符',
                enterAgain: '再次输入密码'
            },
            // 通用
            common: {
                loading: '加载中...',
                processing: '处理中...',
                error: '错误',
                success: '成功',
                edit: '编辑',
                delete: '删除',
                save: '保存',
                cancel: '取消',
                close: '关闭',
                add: '添加',
                confirm: '确认',
                none: '无',
                labelSeparator: '：'
            },
            // 商家
            merchant: {
                route: {
                    accessDenied: '访问受限',
                    notMerchant: '您没有权限访问商家管理后台',
                    backHome: '返回首页'
                },
                dashboard: {
                    title: '商家仪表盘',
                    welcome: '欢迎回来，{{name}}',
                    totalOrders: '总订单数',
                    pendingOrders: '待处理订单',
                    totalRevenue: '总收入',
                    menuItems: '菜品数量',
                    averageRating: '平均评分',
                    completedOrders: '已完成订单',
                    quickActions: '快捷操作',
                    manageOrders: '订单管理',
                    manageMenu: '菜单管理',
                    viewReviews: '查看评价',
                    settings: '设置'
                },
                menu: {
                    title: '菜单管理',
                    addItem: '添加菜品',
                    noItems: '暂无菜品，请添加您的第一个菜品！',
                    available: '上架',
                    unavailable: '下架',
                    editItem: '编辑菜品',
                    addItemTitle: '添加新菜品',
                    saveFailed: '保存菜品失败',
                    deleteConfirm: '确定要删除这个菜品吗？',
                    deleteFailed: '删除菜品失败',
                    form: {
                        name: '菜品名称',
                        description: '描述',
                        price: '价格',
                        category: '分类',
                        categoryPlaceholder: '例如：开胃菜、主菜',
                        imageUrl: '图片 URL',
                        available: '可订购'
                    }
                },
                orders: {
                    title: '订单管理',
                    refresh: '刷新',
                    allOrders: '全部订单',
                    noOrders: '暂无订单',
                    customer: '客户',
                    orderTime: '下单时间',
                    total: '总计',
                    items: '商品数',
                    actions: {
                        viewDetails: '查看详情',
                        confirm: '接单',
                        cancel: '拒绝',
                        startPreparing: '开始制作',
                        finishPreparing: '制作完成',
                        complete: '完成订单'
                    },
                    details: {
                        title: '订单详情',
                        info: '订单信息',
                        status: '状态',
                        customerName: '客户姓名',
                        phone: '联系电话',
                        notes: '备注',
                        products: '订单商品',
                        quantity: '数量',
                        subtotal: '小计'
                    }
                },
                reviews: {
                    title: '客户评价',
                    noReviews: '暂无评价',
                    anonymous: '匿名用户',
                    reply: '回复'
                },
                settings: {
                    title: '餐厅设置',
                    subtitle: '管理您的餐厅信息和设置',
                    success: '设置保存成功',
                    error: '保存设置失败',
                    basicInfo: '基本信息',
                    contactInfo: '联系信息',
                    operationSettings: '运营设置',
                    form: {
                        name: '餐厅名称',
                        description: '描述',
                        cuisine: '菜系',
                        coverImage: '封面图片 URL',
                        phone: '联系电话',
                        address: '地址',
                        hours: '营业时间',
                        deliveryFee: '配送费',
                        minOrder: '起送价',
                        saving: '保存中...',
                        save: '保存更改'
                    }
                }
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // 默认语言
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;