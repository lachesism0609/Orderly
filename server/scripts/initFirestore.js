const { db, auth } = require('../config/firebase');
const admin = require('firebase-admin');

// Sample data
const sampleData = {
    categories: [
        {
            id: 'sushi-rolls',
            name: 'Sushi Rolls',
            nameCn: '寿司卷',
            description: 'Fresh and delicious sushi rolls',
            descriptionCn: '新鲜美味的寿司卷',
            icon: '🍣',
            order: 1,
            isActive: true
        },
        {
            id: 'appetizers',
            name: 'Appetizers',
            nameCn: '开胃菜',
            description: 'Start your meal right',
            descriptionCn: '开启您的美味之旅',
            icon: '🥟',
            order: 2,
            isActive: true
        },
        {
            id: 'main-dishes',
            name: 'Main Dishes',
            nameCn: '主菜',
            description: 'Satisfying main courses',
            descriptionCn: '令人满足的主菜',
            icon: '🍜',
            order: 3,
            isActive: true
        },
        {
            id: 'desserts',
            name: 'Desserts',
            nameCn: '甜点',
            description: 'Sweet endings',
            descriptionCn: '甜蜜的结束',
            icon: '🍰',
            order: 4,
            isActive: true
        },
        {
            id: 'beverages',
            name: 'Beverages',
            nameCn: '饮料',
            description: 'Refreshing drinks',
            descriptionCn: '清爽的饮品',
            icon: '🥤',
            order: 5,
            isActive: true
        }
    ],

    restaurants: [
        {
            name: 'Tokyo Sushi Bar',
            nameCn: '东京寿司吧',
            description: 'Authentic Japanese sushi and sashimi',
            descriptionCn: '正宗日本寿司和刺身',
            cuisineType: 'Japanese',
            cuisineTypeCn: '日本料理',
            email: 'contact@tokyosushi.com',
            phone: '+31 20 123 4567',
            address: {
                street: 'Damstraat 15',
                city: 'Amsterdam',
                postalCode: '1012 JL',
                country: 'Netherlands',
                coordinates: {
                    latitude: 52.3738,
                    longitude: 4.8951
                }
            },
            hours: {
                en: 'Mon-Sun: 11:00 AM - 10:00 PM',
                zh: '周一至周日：11:00 - 22:00'
            },
            operatingHours: [
                { day: 0, open: '11:00', close: '22:00', isClosed: false },
                { day: 1, open: '11:00', close: '22:00', isClosed: false },
                { day: 2, open: '11:00', close: '22:00', isClosed: false },
                { day: 3, open: '11:00', close: '22:00', isClosed: false },
                { day: 4, open: '11:00', close: '22:00', isClosed: false },
                { day: 5, open: '11:00', close: '23:00', isClosed: false },
                { day: 6, open: '11:00', close: '23:00', isClosed: false }
            ],
            about: {
                en: 'Experience the finest Japanese cuisine in Amsterdam. Our chefs bring authentic flavors from Tokyo.',
                zh: '在阿姆斯特丹体验最好的日本料理。我们的厨师带来了来自东京的正宗风味。'
            },
            logo: 'https://via.placeholder.com/200x200?text=Tokyo+Sushi',
            coverImage: 'https://via.placeholder.com/800x400?text=Tokyo+Sushi+Cover',
            images: [],
            rating: 4.5,
            reviewCount: 128,
            totalOrders: 456,
            minOrder: 15,
            deliveryFee: 2.5,
            deliveryTime: '25-35 min',
            deliveryRadius: 5,
            isActive: true,
            isVerified: true,
            isPremium: true
        },
        {
            name: 'Dragon Wok',
            nameCn: '龙锅',
            description: 'Traditional Chinese cuisine',
            descriptionCn: '传统中国菜',
            cuisineType: 'Chinese',
            cuisineTypeCn: '中餐',
            email: 'info@dragonwok.nl',
            phone: '+31 20 234 5678',
            address: {
                street: 'Leidsestraat 45',
                city: 'Amsterdam',
                postalCode: '1017 NT',
                country: 'Netherlands',
                coordinates: {
                    latitude: 52.3640,
                    longitude: 4.8830
                }
            },
            hours: {
                en: 'Mon-Sun: 12:00 PM - 11:00 PM',
                zh: '周一至周日：12:00 - 23:00'
            },
            operatingHours: [
                { day: 0, open: '12:00', close: '23:00', isClosed: false },
                { day: 1, open: '12:00', close: '23:00', isClosed: false },
                { day: 2, open: '12:00', close: '23:00', isClosed: false },
                { day: 3, open: '12:00', close: '23:00', isClosed: false },
                { day: 4, open: '12:00', close: '23:00', isClosed: false },
                { day: 5, open: '12:00', close: '24:00', isClosed: false },
                { day: 6, open: '12:00', close: '24:00', isClosed: false }
            ],
            about: {
                en: 'Authentic Chinese flavors with a modern twist. Family recipes passed down through generations.',
                zh: '带有现代风格的正宗中国风味。代代相传的家庭食谱。'
            },
            logo: 'https://via.placeholder.com/200x200?text=Dragon+Wok',
            coverImage: 'https://via.placeholder.com/800x400?text=Dragon+Wok+Cover',
            images: [],
            rating: 4.3,
            reviewCount: 95,
            totalOrders: 312,
            minOrder: 12,
            deliveryFee: 2.0,
            deliveryTime: '30-40 min',
            deliveryRadius: 4,
            isActive: true,
            isVerified: true,
            isPremium: false
        }
    ]
};

async function initializeCollections() {
    console.log('🚀 Starting Firestore initialization...\n');

    try {
        // 1. Initialize Categories
        console.log('📁 Creating categories...');
        for (const category of sampleData.categories) {
            const categoryRef = db.collection('categories').doc(category.id);
            await categoryRef.set({
                ...category,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`  ✅ Created category: ${category.name}`);
        }

        // 2. Create test user (restaurant owner)
        console.log('\n👤 Creating test user...');
        let testUser;
        try {
            testUser = await auth.createUser({
                email: 'owner@tokyosushi.com',
                password: 'test123456',
                displayName: 'Tokyo Sushi Owner',
                emailVerified: true
            });
            console.log(`  ✅ Created user: ${testUser.email} (UID: ${testUser.uid})`);
        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                testUser = await auth.getUserByEmail('owner@tokyosushi.com');
                console.log(`  ℹ️  User already exists: ${testUser.email} (UID: ${testUser.uid})`);
            } else {
                throw error;
            }
        }

        // Create user document in Firestore
        await db.collection('users').doc(testUser.uid).set({
            uid: testUser.uid,
            email: testUser.email,
            displayName: testUser.displayName,
            phone: '+31 20 123 4567',
            role: 'restaurant',
            addresses: [],
            favoriteRestaurants: [],
            photoURL: '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`  ✅ Created user document in Firestore`);

        // 3. Initialize Restaurants
        console.log('\n🏪 Creating restaurants...');
        const restaurantIds = [];
        for (const restaurant of sampleData.restaurants) {
            const restaurantRef = db.collection('restaurants').doc();
            const restaurantData = {
                ...restaurant,
                id: restaurantRef.id,
                ownerId: testUser.uid, // Link to the test user
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            await restaurantRef.set(restaurantData);
            restaurantIds.push(restaurantRef.id);
            console.log(`  ✅ Created restaurant: ${restaurant.name} (ID: ${restaurantRef.id})`);
        }

        // 4. Initialize Menu Items for Tokyo Sushi Bar
        console.log('\n🍱 Creating menu items...');
        const tokyoSushiId = restaurantIds[0];
        const menuItems = [
            {
                restaurantId: tokyoSushiId,
                name: 'California Roll',
                nameCn: '加州卷',
                description: 'Crab, avocado, cucumber',
                descriptionCn: '蟹肉、牛油果、黄瓜',
                category: 'Sushi Rolls',
                categoryCn: '寿司卷',
                price: 8.50,
                image: 'https://via.placeholder.com/300x300?text=California+Roll',
                tags: ['popular'],
                tagsCn: ['热门'],
                isAvailable: true,
                isPopular: true,
                isNew: false,
                allergens: ['shellfish'],
                dietary: [],
                orderCount: 45,
                rating: 4.5,
                reviewCount: 12
            },
            {
                restaurantId: tokyoSushiId,
                name: 'Salmon Sashimi',
                nameCn: '三文鱼刺身',
                description: 'Fresh Norwegian salmon',
                descriptionCn: '新鲜挪威三文鱼',
                category: 'Sushi Rolls',
                categoryCn: '寿司卷',
                price: 12.00,
                image: 'https://via.placeholder.com/300x300?text=Salmon+Sashimi',
                tags: ['popular', 'fresh'],
                tagsCn: ['热门', '新鲜'],
                isAvailable: true,
                isPopular: true,
                isNew: false,
                allergens: ['fish'],
                dietary: ['gluten-free'],
                orderCount: 67,
                rating: 4.8,
                reviewCount: 18
            },
            {
                restaurantId: tokyoSushiId,
                name: 'Edamame',
                nameCn: '毛豆',
                description: 'Steamed soybeans with sea salt',
                descriptionCn: '海盐蒸毛豆',
                category: 'Appetizers',
                categoryCn: '开胃菜',
                price: 4.50,
                image: 'https://via.placeholder.com/300x300?text=Edamame',
                tags: ['vegetarian', 'healthy'],
                tagsCn: ['素食', '健康'],
                isAvailable: true,
                isPopular: false,
                isNew: false,
                allergens: ['soy'],
                dietary: ['vegan', 'gluten-free'],
                orderCount: 34,
                rating: 4.3,
                reviewCount: 8
            },
            {
                restaurantId: tokyoSushiId,
                name: 'Miso Soup',
                nameCn: '味噌汤',
                description: 'Traditional Japanese soup',
                descriptionCn: '传统日式汤',
                category: 'Appetizers',
                categoryCn: '开胃菜',
                price: 3.50,
                image: 'https://via.placeholder.com/300x300?text=Miso+Soup',
                tags: [],
                tagsCn: [],
                isAvailable: true,
                isPopular: false,
                isNew: false,
                allergens: ['soy'],
                dietary: ['vegetarian'],
                orderCount: 28,
                rating: 4.2,
                reviewCount: 6
            },
            {
                restaurantId: tokyoSushiId,
                name: 'Green Tea Ice Cream',
                nameCn: '绿茶冰淇淋',
                description: 'Creamy matcha ice cream',
                descriptionCn: '香滑抹茶冰淇淋',
                category: 'Desserts',
                categoryCn: '甜点',
                price: 5.00,
                image: 'https://via.placeholder.com/300x300?text=Green+Tea+Ice+Cream',
                tags: ['new'],
                tagsCn: ['新品'],
                isAvailable: true,
                isPopular: false,
                isNew: true,
                allergens: ['dairy'],
                dietary: ['vegetarian'],
                orderCount: 15,
                rating: 4.6,
                reviewCount: 4
            }
        ];

        for (const item of menuItems) {
            const itemRef = db.collection('menuItems').doc();
            await itemRef.set({
                ...item,
                id: itemRef.id,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`  ✅ Created menu item: ${item.name}`);
        }

        // 5. Create a test customer user
        console.log('\n👥 Creating test customer...');
        let customerUser;
        try {
            customerUser = await auth.createUser({
                email: 'customer@test.com',
                password: 'test123456',
                displayName: 'Test Customer',
                emailVerified: true
            });
            console.log(`  ✅ Created customer: ${customerUser.email} (UID: ${customerUser.uid})`);
        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                customerUser = await auth.getUserByEmail('customer@test.com');
                console.log(`  ℹ️  Customer already exists: ${customerUser.email} (UID: ${customerUser.uid})`);
            } else {
                throw error;
            }
        }

        await db.collection('users').doc(customerUser.uid).set({
            uid: customerUser.uid,
            email: customerUser.email,
            displayName: customerUser.displayName,
            phone: '+31 20 987 6543',
            role: 'customer',
            addresses: [
                {
                    id: 'addr_1',
                    label: 'Home',
                    street: 'Prinsengracht 263',
                    city: 'Amsterdam',
                    postalCode: '1016 GV',
                    isDefault: true
                }
            ],
            favoriteRestaurants: [tokyoSushiId],
            photoURL: '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`  ✅ Created customer document in Firestore`);

        console.log('\n✨ Firestore initialization completed successfully!');
        console.log('\n📝 Test Accounts Created:');
        console.log(`  Restaurant Owner: owner@tokyosushi.com / test123456`);
        console.log(`  Customer: customer@test.com / test123456`);
        console.log(`\n🏪 Restaurant IDs:`);
        restaurantIds.forEach((id, index) => {
            console.log(`  ${sampleData.restaurants[index].name}: ${id}`);
        });

    } catch (error) {
        console.error('\n❌ Error during initialization:', error);
        throw error;
    }
}

// Run the initialization
if (require.main === module) {
    initializeCollections()
        .then(() => {
            console.log('\n👋 Exiting...');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { initializeCollections };
