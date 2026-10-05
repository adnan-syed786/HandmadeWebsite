require('dotenv').config();
const connectToMongo = require('../db');
const Product = require('../Models/Product');

async function run() {
  await connectToMongo();
  const items = [
    { name: 'Hand-thrown Pottery Vase', description: 'A unique, hand-thrown ceramic vase with natural glaze.', price: 49.99, category: 'pottery', stock: 12, imageUrl: 'https://images.unsplash.com/photo-1523419409543-301f4098b2ef?q=80&w=800' },
    { name: 'Artisan Woven Textile Scarf', description: 'Soft, ethically sourced cotton scarf with traditional patterns.', price: 29.5, category: 'textiles', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800' },
    { name: 'Handmade Silver Pendant', description: 'Minimalist silver pendant crafted by local artisans.', price: 59.0, category: 'jewelry', stock: 8, imageUrl: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=800' },
    { name: 'Clay Mug Set (x2)', description: 'Pair of rustic clay mugs perfect for coffee or tea.', price: 24.0, category: 'pottery', stock: 20, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800' },
  ];

  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('Products already exist, skipping seed.');
      process.exit(0);
    }
    await Product.insertMany(items);
    console.log('Seeded products successfully.');
  } catch (e) {
    console.error('Seed failed:', e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
