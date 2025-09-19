const Product = require('../models/Product');
const MenProduct = require('../models/MenProduct');
const WomenProduct = require('../models/WomenProduct');
const KidsProduct = require('../models/KidsProduct');


const getModelByCategory = (category) => {
  switch (category.toLowerCase()) {
    case 'men':
      return MenProduct;
    case 'women':
      return WomenProduct;
    case 'kids':
      return KidsProduct;
    default:
      return Product;
  }
};


exports.addProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;

    // Handle images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Get the appropriate model based on category
    const ProductModel = getModelByCategory(category);

    const product = new ProductModel({
      name,
      category,
      description,
      price,
      stock,
      imageUrl: images
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    // Fetch products from all category-specific collections
    const [menProducts, womenProducts, kidsProducts] = await Promise.all([
      MenProduct.find(),
      WomenProduct.find(),
      KidsProduct.find()
    ]);

    // Combine all products
    const allProducts = [...menProducts, ...womenProducts, ...kidsProducts];
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Search in all category-specific collections
    let product = await MenProduct.findById(productId);
    if (!product) product = await WomenProduct.findById(productId);
    if (!product) product = await KidsProduct.findById(productId);
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;
    const productId = req.params.id;
    
    // Find the product in all collections
    let product = await MenProduct.findById(productId);
    let ProductModel = MenProduct;
    
    if (!product) {
      product = await WomenProduct.findById(productId);
      ProductModel = WomenProduct;
    }
    if (!product) {
      product = await KidsProduct.findById(productId);
      ProductModel = KidsProduct;
    }
    
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // If category is being changed, we need to move the product to the new collection
    if (category && category !== product.category) {
      const newProductModel = getModelByCategory(category);
      
      // Create new product in the new collection
      const newProduct = new newProductModel({
        name: name || product.name,
        category: category,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
        imageUrl: product.imageUrl
      });

      // If new images uploaded, replace
      if (req.files && req.files.length > 0) {
        newProduct.imageUrl = req.files.map(file => `/uploads/${file.filename}`);
      }

      const savedProduct = await newProduct.save();
      
      // Delete from old collection
      await ProductModel.findByIdAndDelete(productId);
      
      return res.json({ message: 'Product updated and moved successfully', product: savedProduct });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    // If new images uploaded, replace
    if (req.files && req.files.length > 0) {
      product.imageUrl = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updatedProduct = await product.save();
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Try to delete from all collections
    let product = await MenProduct.findByIdAndDelete(productId);
    if (!product) product = await WomenProduct.findByIdAndDelete(productId);
    if (!product) product = await KidsProduct.findByIdAndDelete(productId);
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const ProductModel = getModelByCategory(category);
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products by category', error: error.message });
  }
};
