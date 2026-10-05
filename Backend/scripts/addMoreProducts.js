require('dotenv').config();
const connectToMongo = require('../db');
const Product = require('../Models/Product');

const newProducts = [
  {
    name: 'Hand-Carved Wooden Bowl',
    description: 'Beautiful hand-carved wooden serving bowl with natural finish. Perfect for fruits or salads.',
    price: 45.00,
    category: 'pottery',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800'
  },
  {
    name: 'Macramé Wall Hanging',
    description: 'Intricate macramé wall art handwoven with natural cotton rope. Adds bohemian charm to any space.',
    price: 65.00,
    category: 'textiles',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1563804645012-adb29d3deec0?q=80&w=800'
  },
  {
    name: 'Handwoven Rattan Basket',
    description: 'Traditional rattan storage basket, handwoven by local artisans. Multi-purpose and eco-friendly.',
    price: 38.50,
    category: 'pottery',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800'
  },
  {
    name: 'Artisan Leather Journal',
    description: 'Hand-stitched leather journal with handmade paper. Perfect for writing, sketching, or journaling.',
    price: 52.00,
    category: 'textiles',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800'
  },
  {
    name: 'Handmade Beaded Bracelet Set',
    description: 'Set of 3 colorful beaded bracelets handcrafted with natural stones and glass beads.',
    price: 28.00,
    category: 'jewelry',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800'
  },
  {
    name: 'Ceramic Tea Set (4 pieces)',
    description: 'Hand-thrown ceramic tea set including teapot and 3 cups with glazed finish.',
    price: 78.00,
    category: 'pottery',
    stock: 6,
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800'
  },
  {
    name: 'Handwoven Cotton Throw Blanket',
    description: 'Soft cotton throw blanket with traditional geometric patterns. Hand-loomed using natural dyes.',
    price: 89.00,
    category: 'textiles',
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f29da8c313?q=80&w=800'
  },
  {
    name: 'Turquoise Stone Necklace',
    description: 'Handmade necklace featuring genuine turquoise stones with silver wire wrapping.',
    price: 95.00,
    category: 'jewelry',
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800'
  },
  {
    name: 'Hand-Painted Decorative Plate',
    description: 'Ceramic decorative plate with intricate hand-painted floral motifs. Wall-hanging ready.',
    price: 42.00,
    category: 'pottery',
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800'
  },
  {
    name: 'Artisan Copper Earrings',
    description: 'Handcrafted copper drop earrings with hammered texture and antique finish.',
    price: 32.50,
    category: 'jewelry',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800'
  }
];

async function run() {
  await connectToMongo();
  try {
    const result = await Product.insertMany(newProducts);
    console.log(`✅ Successfully added ${result.length} new handicraft products!`);
    console.log('Products added:');
    result.forEach(p => console.log(`  - ${p.name} ($${p.price})`));
  } catch (e) {
    console.error('❌ Error adding products:', e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
