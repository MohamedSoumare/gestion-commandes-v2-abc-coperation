const cnx = require('../database/db');

const productModule = {
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      console.error('Error retrieving products:', error);
      throw new Error('Unable to retrieve products. Please try again later.');
    }
  },
  async getById(id) {
    try {
      // Validate ID
      if (isNaN(id)) {
        throw new Error('Product ID must be a valid number.');
      }
  
      const [rows] = await cnx.query('SELECT * FROM products WHERE id = ?', [id]);
  
      if (rows.length > 0) {
        return rows[0]; 
      } else {
        console.error(`Product with ID ${id} not found in the database.`);
      }
    } catch (error) {
      // Log detailed error for debugging
      console.error(`Error retrieving product with ID ${id}:`, error);
      throw new Error(`Unable to retrieve product with ID ${id}.`);
    }
  },  

  async create(product) {
    try {
      const { name, description, stock, price, category, barcode, status } = product;
  
      // Check if all fields are present
      if (!name || !description || !stock || !price || !category || !barcode || !status) {
        throw new Error('All fields (name, description, stock, price, category, barcode, status) are required.');
      }
  
      // Check if the barcode already exists
      const [existingProduct] = await cnx.query(
        'SELECT * FROM products WHERE barcode = ?',
        [barcode]
      );
      if (existingProduct.length > 0) {
        throw new Error('Barcode already exists. Please use a unique barcode.');
      }
  
      // Insert the product into the database
      const [result] = await cnx.query(
        'INSERT INTO products (name, description, stock, price, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, stock, price, category, barcode, status]
      );
      return result.insertId; // Returns the newly created product ID
  
    } catch (error) {
      if (error.message.includes('All fields') || error.message.includes('Barcode already exists')) {
        throw error; // Returns the original error for clean display
      } else {
        console.error('Error creating product:', error);
        throw new Error('Unable to create product. Please check your input and try again.');
      }
    }
  },  
  
  async update(id, product) {
    try {
      const { name, description, stock, price, category, barcode, status } = product;
  
      // Check if all fields are present
      if (!name || !description || !stock || !price || !category || !barcode || !status) {
        throw new Error('All fields (name, description, stock, price, category, barcode, status) are required.');
      }
  
      // Check if the barcode already exists for another product (excluding the current product)
      const [existingProduct] = await cnx.query(
        'SELECT * FROM products WHERE barcode = ? AND id != ?',
        [barcode, id]
      );
      if (existingProduct.length > 0) {
        throw new Error('Barcode already exists. Please use a unique barcode.');
      }
  
      // Update the product in the database
      const [result] = await cnx.query(
        'UPDATE products SET name = ?, description = ?, stock = ?, price = ?, category = ?, barcode = ?, status = ? WHERE id = ?',
        [name, description, stock, price, category, barcode, status, id]
      );
  
      if (result.affectedRows === 0) {
        throw new Error(`Product with ID ${id} not found.`);
      }
  
      return result.affectedRows;
  
    } catch (error) {
      if (error.message.includes('All fields') || error.message.includes('Barcode already exists')) {
        throw error; // Returns the original error for clean display
      } else {
        console.error(`Error updating product with ID ${id}:`, error);
        throw new Error(`Unable to update product with ID ${id}. Please check the input.`);
      }
    }
  },

  async delete(id) {
    try {
      // Check if the product exists
      const [product] = await cnx.query('SELECT id FROM products WHERE id = ?', [id]);
      if (product.length === 0) {
        throw new Error(`Product with ID ${id} not found.`);
      }
  
 
      const [result] = await cnx.query('DELETE FROM products WHERE id = ?', [id]);
      return result.affectedRows; 
    } catch (error) {
      
      console.log(`An error occurred: ${error.message}`);
      throw new Error(`Unable to delete product with ID ${id}.`);
    }
    
  }
  
  
  
};

module.exports = productModule;
