const cnx = require('../database/db'); 

const customersModule = {
  
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM customers');
      return rows;
    } catch (error) {
      console.error('Error while retrieving clients:', error);
      throw error;
    }
  },

  
  async getById(id) {
    try {
      const [rows] = await cnx.query('SELECT * FROM customers WHERE id = ?', [id]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        console.log('ID Customers not found');
      }
    } catch (error) {
      console.error(`Erreur when retrieving the client with ID ${id}:`, error);
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
      console.error('Error while creating the client:', error);
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
      console.error(`Error while updating the client with ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const result = await cnx.query('DELETE FROM customers WHERE id = ?', [id]);
      return result[0].affectedRows;
    } catch (error) {
      console.error(`Error when deleting the client with ID ${id}:`, error);
      throw error;
    }
  },
};

module.exports = customersModule;
