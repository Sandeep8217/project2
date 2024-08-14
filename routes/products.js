const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    res.status(500).send('Error retrieving products');
  }
});

// Add a new product form
router.get('/new', (req, res) => {
  res.render('newProduct');
});

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      supplier: req.body.supplier,
      sales: req.body.sales,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.file ? req.file.path.replace('public/', '') : undefined
    });
    await product.save();
    res.redirect('/products');
  } catch (error) {
    console.log('Error saving product:', error);
    res.status(400).send(error.message || 'Error saving product');
  }
});

// Get the form to edit a product
router.get('/:id/edit', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('editProduct', { product });
  } catch (error) {
    res.status(500).send('Error retrieving product for editing');
  }
});

// Update an existing product
router.post('/:id/edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      supplier: req.body.supplier,
      sales: req.body.sales,
      price: req.body.price,
      quantity: req.body.quantity
    };
    if (req.file) {
      updateData.image = req.file.path.replace('public/', '');
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/products');
  } catch (error) {
    res.status(400).send('Error updating product');
  }
});

// Delete a product
router.post('/:id/delete', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
});

// Search for a product
router.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' }
    });
    res.render('index', { products });
  } catch (error) {
    res.status(500).send('Error searching for products');
  }
});

module.exports = router;
