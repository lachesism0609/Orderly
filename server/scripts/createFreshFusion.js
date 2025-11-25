const { db, auth } = require('../config/firebase');
const admin = require('firebase-admin');

const freshFusionData = {
    id: 'fresh-fusion',
    name: 'Fresh Fusion',
    nameCn: '鲜融寿司',
    description: 'Experience authentic Japanese cuisine with our carefully crafted sushi and traditional dishes.',
    descriptionCn: '体验正宗的日本料理，我们精心制作的寿司和传统菜肴。',
    cuisineType: 'Japanese Sushi',
    cuisineTypeCn: '日式寿司',
    rating: 4.8,
    reviewCount: 328,
    deliveryTime: '25-35 min',
    minOrder: 15.00,
    image: 'https://i.imgur.com/tOYd2d8.jpeg',
    coverImage: 'https://i.imgur.com/tOYd2d8.jpeg',
    address: '123 Main Street, City Center',
    phone: '+1 234-567-8900',
    hours: {
        en: 'Mon-Sun: 11:00 AM - 10:00 PM',
        zh: '周一至周日：11:00 - 22:00'
    },
    about: {
        en: 'Fresh Fusion brings you the finest selection of authentic Japanese sushi with creative modern combinations. Our master chefs use only the freshest ingredients to create exceptional dining experiences.',
        zh: 'Fresh Fusion为您带来最优质的正宗日式寿司，融合创意现代组合。我们的主厨只使用最新鲜的食材，为您打造非凡的用餐体验。'
    },
    isActive: true
};

const menuItems = [
    {
        title: "Salmon Nigiri",
        name: "Salmon Nigiri",
        category: "Nigiri",
        price: 8.99,
        description: "Fresh salmon on hand-pressed rice",
        image: "https://i.imgur.com/tOYd2d8.jpeg",
        available: true
    },
    {
        title: "California Roll",
        name: "California Roll",
        category: "Maki",
        price: 7.99,
        description: "Crab meat, avocado, and cucumber roll",
        image: "https://i.imgur.com/siPbjUT.jpeg",
        available: true
    },
    {
        title: "Vegetable Tempura",
        name: "Vegetable Tempura",
        category: "Appetizers",
        price: 6.99,
        description: "Assorted vegetables in crispy tempura batter",
        image: "https://i.imgur.com/9VTaNcl.jpeg",
        available: true
    },
    {
        title: "Spicy Tuna Roll",
        name: "Spicy Tuna Roll",
        category: "Maki",
        price: 9.99,
        description: "Fresh tuna with spicy mayo and cucumber",
        image: "https://i.imgur.com/QuYknb3.jpeg",
        available: true
    },
    {
        title: "Dragon Roll",
        name: "Dragon Roll",
        category: "Special Rolls",
        price: 14.99,
        description: "Eel and cucumber roll topped with avocado",
        image: "https://i.imgur.com/01PK3b1.jpeg",
        available: true
    }
];

// Test Customer Data
const testCustomer = {
    email: 'customer@test.com',
    password: 'password123',
    displayName: 'Test Customer',
    firstName: 'Test',
    lastName: 'Customer'
};

// Mock Orders Data
const mockOrdersData = [
    {
        id: 'ORD001',
        date: new Date('2024-11-24'),
        status: 'delivered',
        total: 25.97,
        items: [
            { name: 'Salmon Nigiri', quantity: 2, price: 8.99, image: 'https://i.imgur.com/tOYd2d8.jpeg' },
            { name: 'California Roll', quantity: 1, price: 7.99, image: 'https://i.imgur.com/siPbjUT.jpeg' }
        ]
    },
    {
        id: 'ORD002',
        date: new Date('2024-11-20'),
        status: 'preparing',
        total: 24.98,
        items: [
            { name: 'Dragon Roll', quantity: 1, price: 14.99, image: 'https://i.imgur.com/01PK3b1.jpeg' },
            { name: 'Spicy Tuna Roll', quantity: 1, price: 9.99, image: 'https://i.imgur.com/QuYknb3.jpeg' }
        ]
    }
];

async function createFreshFusion() {
    console.log('🚀 Starting Fresh Fusion creation...\n');

    try {
        // 1. Create Merchant User
        console.log('👤 Creating merchant user...');
        const email = 'owner@freshfusion.com';
        const password = 'password123';
        let userRecord;

        try {
            userRecord = await auth.getUserByEmail(email);
            console.log(`  ℹ️  User already exists: ${email}`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                userRecord = await auth.createUser({
                    email: email,
                    password: password,
                    displayName: 'Fresh Fusion',
                    emailVerified: true
                });
                console.log(`  ✅ Created user: ${email}`);
            } else {
                throw error;
            }
        }

        // 2. Create User Document
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: email,
            displayName: 'Fresh Fusion',
            firstName: 'Fresh',
            lastName: 'Fusion',
            role: 'merchant',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`  ✅ Updated user document`);

        // 3. Create Restaurant Document
        console.log('\n🏪 Creating restaurant...');
        const restaurantRef = db.collection('restaurants').doc(freshFusionData.id);

        await restaurantRef.set({
            ...freshFusionData,
            ownerId: userRecord.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`  ✅ Created/Updated restaurant: ${freshFusionData.name} (ID: ${freshFusionData.id})`);

        // 4. Create Menu Items
        console.log('\n🍱 Creating menu items...');

        // Delete existing menu items for this restaurant to avoid duplicates if running multiple times
        const existingMenuSnapshot = await db.collection('menuItems')
            .where('restaurantId', '==', freshFusionData.id)
            .get();

        if (!existingMenuSnapshot.empty) {
            const batch = db.batch();
            existingMenuSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            console.log(`  🗑️  Deleted ${existingMenuSnapshot.size} existing menu items`);
        }

        // Add new menu items
        for (const item of menuItems) {
            const itemRef = db.collection('menuItems').doc();
            await itemRef.set({
                ...item,
                id: itemRef.id,
                restaurantId: freshFusionData.id,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`  ✅ Created menu item: ${item.name}`);
        }

        // 5. Create Test Customer
        console.log('\n👤 Creating test customer...');
        let customerRecord;
        try {
            customerRecord = await auth.getUserByEmail(testCustomer.email);
            console.log(`  ℹ️  Customer already exists: ${testCustomer.email}`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                customerRecord = await auth.createUser({
                    email: testCustomer.email,
                    password: testCustomer.password,
                    displayName: testCustomer.displayName,
                    emailVerified: true
                });
                console.log(`  ✅ Created customer: ${testCustomer.email}`);
            } else {
                throw error;
            }
        }

        await db.collection('users').doc(customerRecord.uid).set({
            uid: customerRecord.uid,
            email: testCustomer.email,
            displayName: testCustomer.displayName,
            firstName: testCustomer.firstName,
            lastName: testCustomer.lastName,
            role: 'customer',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // 6. Create Orders
        console.log('\n📦 Creating orders...');

        for (const orderData of mockOrdersData) {
            const orderRef = db.collection('orders').doc(orderData.id);
            await orderRef.set({
                restaurantId: freshFusionData.id,
                restaurantName: freshFusionData.name,
                restaurantImage: freshFusionData.image,
                userId: customerRecord.uid,
                customerName: testCustomer.displayName,
                customerPhone: '+1 555-0123', // Added phone for merchant view
                status: orderData.status,
                total: orderData.total,
                items: orderData.items,
                createdAt: admin.firestore.Timestamp.fromDate(orderData.date),
                updatedAt: admin.firestore.Timestamp.fromDate(orderData.date)
            });
            console.log(`  ✅ Created order: ${orderData.id}`);
        }

        // 7. Create Review (for the delivered order)
        console.log('\n⭐ Creating review...');
        const reviewId = 'REV001';
        const reviewRef = db.collection('reviews').doc(reviewId);
        await reviewRef.set({
            id: reviewId,
            orderId: 'ORD001',
            restaurantId: freshFusionData.id,
            userId: customerRecord.uid,
            userName: testCustomer.displayName,
            rating: 5,
            comment: "Absolutely delicious! The Salmon Nigiri was incredibly fresh and the California Roll was perfect. Will definitely order again!",
            createdAt: admin.firestore.Timestamp.fromDate(new Date('2024-11-25')),
            reply: null
        });
        console.log(`  ✅ Created review for ORD001`);

        console.log('\n✨ Fresh Fusion setup completed successfully!');
        console.log(`\n🔑 Login Credentials:`);
        console.log(`  Email: ${email}`);
        console.log(`  Password: ${password}`);

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    createFreshFusion()
        .then(() => {
            console.log('\n👋 Exiting...');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Fatal error:', error);
            process.exit(1);
        });
}
