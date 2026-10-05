require('dotenv').config();
const connectToMongo = require('../db');
const Product = require('../Models/Product');
const fs = require('fs');
const path = require('path');

async function run() {
  await connectToMongo();
  
  try {
    // Read the product.json file from frontend directory
    const jsonPath = path.join(__dirname, '..', '..', 'fronted', 'product.json');
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    console.log(`📦 Found ${productsData.length} products in product.json`);
    
    // Clear existing products (optional - comment out if you want to keep old products)
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products from database');
    
    // Prepare products for insertion (remove _id field to let MongoDB generate new ones)
    const productsToInsert = productsData.map(product => {
      const { _id, ...productWithoutId } = product;
      return productWithoutId;
    });
    
    // Insert products
    const result = await Product.insertMany(productsToInsert);
    console.log(`✅ Successfully added ${result.length} products to MongoDB!`);
    console.log('\nProducts added:');
    result.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.name} - $${p.price} (${p.category}) - Stock: ${p.stock}`);
    });
    
  } catch (e) {
    console.error('❌ Error updating products:', e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
