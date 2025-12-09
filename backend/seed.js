require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// MongoDB Connection - Same database as server.js
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery_homework';

// Sample products with diverse categories
const sampleProducts = [
  // Fruits (6 products)
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
  {
    name: 'Fresh Oranges',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e',
    category: 'Fruits',
    description: 'Sweet and juicy oranges, packed with vitamin C',
    stock: 85
  },
  {
    name: 'Red Grapes',
    price: 5.49,
    imageUrl: 'https://images.unsplash.com/photo-1599819177331-32ab9b6c50b6',
    category: 'Fruits',
    description: 'Seedless red grapes, perfect for snacking',
    stock: 70
  },
  {
    name: 'Fresh Strawberries',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1543528176-61b239494933',
    category: 'Fruits',
    description: 'Sweet strawberries, locally grown',
    stock: 45
  },
  {
    name: 'Ripe Mangoes',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078',
    category: 'Fruits',
    description: 'Tropical mangoes, sweet and delicious',
    stock: 40
  },
  
  // Vegetables (8 products)
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
  {
    name: 'Fresh Broccoli',
    price: 3.49,
    imageUrl: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e',
    category: 'Vegetables',
    description: 'Fresh broccoli crowns, vitamin-rich',
    stock: 55
  },
  {
    name: 'Organic Carrots',
    price: 2.79,
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
    category: 'Vegetables',
    description: 'Crunchy organic carrots, great for snacking',
    stock: 90
  },
  {
    name: 'Bell Peppers',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83',
    category: 'Vegetables',
    description: 'Mixed color bell peppers, sweet and crisp',
    stock: 60
  },
  {
    name: 'Fresh Cucumbers',
    price: 2.29,
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e',
    category: 'Vegetables',
    description: 'Fresh cucumbers, perfect for salads',
    stock: 75
  },
  {
    name: 'Red Onions',
    price: 1.99,
    imageUrl: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1',
    category: 'Vegetables',
    description: 'Fresh red onions, flavorful and aromatic',
    stock: 100
  },
  {
    name: 'Fresh Lettuce',
    price: 3.29,
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1',
    category: 'Vegetables',
    description: 'Crisp romaine lettuce, perfect for salads',
    stock: 50
  },
  
  // Dairy (6 products)
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
  },
  {
    name: 'Cheddar Cheese',
    price: 8.49,
    imageUrl: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b',
    category: 'Dairy',
    description: 'Sharp cheddar cheese, aged to perfection',
    stock: 35
  },
  {
    name: 'Fresh Butter',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d',
    category: 'Dairy',
    description: 'Unsalted butter, perfect for baking',
    stock: 45
  },
  {
    name: 'Cream Cheese',
    price: 4.79,
    imageUrl: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a',
    category: 'Dairy',
    description: 'Smooth cream cheese, 8oz package',
    stock: 40
  },
  {
    name: 'Sour Cream',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da',
    category: 'Dairy',
    description: 'Fresh sour cream, 16oz container',
    stock: 55
  },

  // Bakery (5 products)
  {
    name: 'Whole Wheat Bread',
    price: 3.49,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    category: 'Bakery',
    description: 'Freshly baked whole wheat bread',
    stock: 40
  },
  {
    name: 'Croissants',
    price: 5.99,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    category: 'Bakery',
    description: 'Buttery French croissants, pack of 6',
    stock: 25
  },
  {
    name: 'Bagels',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6',
    category: 'Bakery',
    description: 'Assorted bagels, pack of 6',
    stock: 30
  },
  {
    name: 'Sourdough Bread',
    price: 6.49,
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73',
    category: 'Bakery',
    description: 'Artisan sourdough bread, fresh daily',
    stock: 20
  },
  {
    name: 'Chocolate Muffins',
    price: 7.99,
    imageUrl: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa',
    category: 'Bakery',
    description: 'Double chocolate muffins, pack of 6',
    stock: 35
  },

  // Beverages (6 products)
  {
    name: 'Orange Juice',
    price: 5.49,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
    category: 'Beverages',
    description: 'Freshly squeezed orange juice, 64oz',
    stock: 55
  },
  {
    name: 'Apple Juice',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1553530979-76d0f7ab3e5c',
    category: 'Beverages',
    description: '100% pure apple juice, 64oz',
    stock: 60
  },
  {
    name: 'Sparkling Water',
    price: 3.99,
    imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d',
    category: 'Beverages',
    description: 'Sparkling mineral water, pack of 6',
    stock: 80
  },
  {
    name: 'Green Tea',
    price: 6.99,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
    category: 'Beverages',
    description: 'Premium green tea bags, box of 50',
    stock: 45
  },
  {
    name: 'Coffee Beans',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
    category: 'Beverages',
    description: 'Arabica coffee beans, 1lb bag',
    stock: 30
  },
  {
    name: 'Almond Milk',
    price: 4.49,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    category: 'Beverages',
    description: 'Unsweetened almond milk, 64oz',
    stock: 50
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
