require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// MongoDB Connection - Same database as server.js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery_homework';

// Sample products with diverse categories
const sampleProducts = [
  // Fruits (2 products)
  {
    name: 'Fresh Apples',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb',
    category: 'Fruits',
    description: 'Crisp and sweet red apples, perfect for snacking or baking',
    stock: 100
  },
  {
    name: 'Organic Bananas',
    price: 2.49,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    category: 'Fruits',
    description: 'Ripe organic bananas, rich in potassium and naturally sweet',
    stock: 150
  },
  
  // Vegetables (2 products)
  {
    name: 'Fresh Spinach',
    price: 2.99,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    category: 'Vegetables',
    description: 'Organic baby spinach leaves, packed with nutrients',
    stock: 80
  },
  {
    name: 'Cherry Tomatoes',
    price: 4.49,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
    category: 'Vegetables',
    description: 'Sweet and juicy cherry tomatoes, perfect for salads',
    stock: 65
  },
  
  // Dairy (2 products)
  {
    name: 'Whole Milk',
    price: 4.29,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    category: 'Dairy',
    description: 'Fresh whole milk, 1 gallon, vitamin D fortified',
    stock: 50
  },
  {
    name: 'Greek Yogurt',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    category: 'Dairy',
    description: 'Creamy Greek yogurt, high protein, 32oz container',
    stock: 60
  }
];

/**
 * Seed Database Function
 * - Connects to MongoDB
 * - Deletes all existing products
 * - Inserts sample products
 * - Exits cleanly with appropriate status codes
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding process...\n');
    
    // Step 1: Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📦 Database: ${mongoose.connection.name}\n`);

    // Step 2: Delete all existing products (clean slate)
    console.log('🗑️  Deleting all existing products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing products\n`);

    // Step 3: Insert sample products
    console.log('📦 Inserting sample products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${products.length} products\n`);

    // Step 4: Display seeded products
    console.log('� Seeded Products Summary:');
    console.log('─'.repeat(80));
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Category: ${product.category} | Price: $${product.price} | Stock: ${product.stock}`);
      console.log(`   ID: ${product._id}`);
      console.log('─'.repeat(80));
    });

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`📊 Total products: ${products.length}`);
    
    // Step 5: Exit cleanly with success code
    process.exit(0);
    
  } catch (error) {
    // Handle any errors during seeding
    console.error('\n❌ Error seeding database:', error.message);
    console.error('💡 Make sure MongoDB is running on your system');
    
    if (error.name === 'ValidationError') {
      console.error('⚠️  Validation Error Details:');
      Object.values(error.errors).forEach(err => {
        console.error(`   - ${err.message}`);
      });
    }
    
    // Exit with failure code
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
