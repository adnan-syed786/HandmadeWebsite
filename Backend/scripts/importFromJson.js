require('dotenv').config();
const connectToMongo = require('../db');
const Product = require('../Models/Product');
const fs = require('fs');
const path = require('path');

async function run() {
  await connectToMongo();
  
  try {
    // Read the product.json file from frontend
    const jsonPath = path.join(__dirname, '../../fronted/product.json');
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`Found ${productsData.length} products in JSON file`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products from database');
    
    // Insert products from JSON
    await Product.insertMany(productsData);
    console.log('Successfully imported products from JSON file');
    
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);
    
  } catch (e) {
    console.error('Import failed:', e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
