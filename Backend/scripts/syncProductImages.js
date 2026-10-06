require("dotenv").config();
const fs = require("fs");
const path = require("path");
const connectToMongo = require("../db");
const Product = require("../Models/Product");
const {
  listProductImageDirectories,
  findProductImageDirectory,
  imagesFromDirectory,
} = require("./productImportImages");

const productJsonPath = path.join(__dirname, "..", "..", "fronted", "product.json");

async function syncProductImages() {
  const productsData = JSON.parse(fs.readFileSync(productJsonPath, "utf8"));
  const imageDirectories = listProductImageDirectories();
  let updated = 0;
  let added = 0;
  let skipped = 0;

  for (const product of productsData) {
    const imageDirectory = findProductImageDirectory(product.name, imageDirectories);
    if (!imageDirectory) {
      skipped += 1;
      continue;
    }

    const images = imagesFromDirectory(imageDirectory);
    if (!images.length) {
      skipped += 1;
      continue;
    }

    const existingProduct = await Product.findOne({ name: product.name });
    if (existingProduct) {
      existingProduct.imageUrl = images[0];
      existingProduct.images = images;
      await existingProduct.save();
      updated += 1;
      console.log(`Updated ${product.name} with ${images.length} images.`);
    } else {
      const { _id, ...productWithoutId } = product;
      await Product.create({
        ...productWithoutId,
        imageUrl: images[0],
        images,
      });
      added += 1;
      console.log(`Added ${product.name} with ${images.length} images.`);
    }
  }

  console.log(`Image sync complete: ${updated} updated, ${added} added, ${skipped} skipped.`);
}

async function run() {
  await connectToMongo();
  try {
    await syncProductImages();
  } catch (error) {
    console.error("Product image sync failed:", error);
    process.exitCode = 1;
  } finally {
    await Product.db.close();
  }
}

run();
