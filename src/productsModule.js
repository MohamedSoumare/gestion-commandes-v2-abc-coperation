const cnx = require('../database/db');

const productsModule = {
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

async getById(id) {
    try {
      const [rows] = await cnx.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows.length > 0 ? rows[0] : null; // Retourne null si le produit n'est pas trouvé
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  },

async create(product) {
    try {
      const { name, description, stock, price, category, barcode, status } = product;
      const [result] = await cnx.query(
        'INSERT INTO products (name, description, stock, price, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, stock, price, category, barcode, status]
      );
      return result.insertId; // Retourne l'ID du produit nouvellement créé
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  async update(id, product) {
    try {
      const { name, description, stock, price, category, barcode, status } = product;
      const [result] = await cnx.query(
        'UPDATE products SET name = ?, description = ?, stock = ?, price = ?, category = ?, barcode = ?, status = ? WHERE id = ?',
        [name, description, stock, price, category, barcode, status, id]
      );
      return result.affectedRows; // Retourne le nombre de lignes affectées
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const [result] = await cnx.query('DELETE FROM products WHERE id = ?', [id]);
      return result.affectedRows; 
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }
};

module.exports = productsModule;
