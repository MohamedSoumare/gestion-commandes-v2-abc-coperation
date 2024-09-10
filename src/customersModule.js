const cnx = require('../database/db'); 

const customersModule = {
  
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM customers');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  
  async getById(id) {
    try {
      const [rows] = await cnx.query('SELECT * FROM customers WHERE id = ?', [id]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du client avec ID ${id}:`, error);
      throw error;
    }
  },

  async create(data) {
    try {
      const result = await cnx.query(
        'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)',
        [data.name, data.address, data.email, data.phone]
      );
      return result[0].insertId;
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const result = await cnx.query(
        'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?',
        [data.name, data.address, data.email, data.phone, id]
      );
      return result[0].affectedRows;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du client avec ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await cnx.query('DELETE FROM customers WHERE id = ?', [id]);
      return result[0].affectedRows;
    } catch (error) {
      console.error(`Erreur lors de la suppression du client avec ID ${id}:`, error);
      throw error;
    }
  },
};

module.exports = customersModule;
