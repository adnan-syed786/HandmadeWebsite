const fs = require("fs");
const path = require("path");

const frontendRoot = path.join(__dirname, "..", "..", "fronted");
const productImagesRoot = path.join(frontendRoot, "public", "Images", "Products");
const imageExtensionPattern = /\.(jpe?g|png|webp)$/i;

function normaliseName(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function listProductImageDirectories() {
  if (!fs.existsSync(productImagesRoot)) return [];

  return fs
    .readdirSync(productImagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function findProductImageDirectory(productName, directories) {
  const normalisedProductName = normaliseName(productName);
  return directories.find((directory) => normaliseName(directory) === normalisedProductName);
}

function imagesFromDirectory(directory) {
  const fullPath = path.join(productImagesRoot, directory);

  return fs
    .readdirSync(fullPath)
    .filter((fileName) => imageExtensionPattern.test(fileName))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .slice(0, 5)
    .map((fileName) => `/Images/Products/${directory}/${fileName}`);
}

function prepareProductsForImport(productsData) {
  const imageDirectories = listProductImageDirectories();

  return productsData.map((product) => {
    const { _id, ...productWithoutId } = product;
    const existingImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const imageDirectory = findProductImageDirectory(product.name, imageDirectories);
    const directoryImages = imageDirectory ? imagesFromDirectory(imageDirectory) : [];
    const images = existingImages.length
      ? existingImages
      : directoryImages.length
        ? directoryImages
        : product.imageUrl
          ? [product.imageUrl]
          : [];

    return {
      ...productWithoutId,
      imageUrl: images[0] || product.imageUrl || "",
      images,
    };
  });
}

module.exports = {
  prepareProductsForImport,
  listProductImageDirectories,
  findProductImageDirectory,
  imagesFromDirectory,
};
