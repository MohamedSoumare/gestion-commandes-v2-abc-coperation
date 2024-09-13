const cnx = require('../database/db');

const customersModule = {

  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM customers');
      return rows;
    } catch (error) {
      console.error('Error while retrieving customers:', error);
      throw new Error('Unable to retrieve customers. Please try again later.');
    }
  },

  async getById(id) {
    try {
      const [rows] = await cnx.query('SELECT * FROM customers WHERE id = ?', [id]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error(`Customer with ID ${id} not found. Please add the customer first.`);
      }
    } catch (error) {
      console.error(`Error when retrieving the customer with ID ${id}:`, error);
      throw new Error(`Unable to retrieve the customer with ID ${id}.`);
    }
  },

  async create(customer) {

    try {
      // Validation: check for empty fields
      if(!customer.name || !customer.address || !customer.email || !customer.phone) {
        throw new Error('All fields (name, address, email, phone) are required and cannot be empty.');
      }

      // Validation: check for valid phone number (up to 20 digits)
      const phone = /^\d{1,20}$/;
      if (!phone.test(customer.phone)) {
        throw new Error('Phone number must contain only digits and be at most 20 characters long.');
      }

      // Validation: check for valid email format
      const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.test(customer.email)) {
        throw new Error('Invalid email format.');
      }

      const [result] = await cnx.query(
        'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)',
        [customer.name, customer.address, customer.email, customer.phone]
      );
      return result.insertId;
    } catch (error) {
      if (error.message.includes('All fields') || error.message.includes('Phone number') || error.message.includes('Invalid email')) {
        throw error;
      } else {
        console.error('Error while creating the customer:', error);
        throw new Error('Unable to create customer. Please check your input and try again.');
      }
    }
  },

  async update(id, customer) {
    try {
      // Validation: check for empty fields
      if (!customer.name || !customer.address || !customer.email || !customer.phone) {
        throw new Error('All fields (name, address, email, phone) are required and cannot be empty.');
      }

      // Validation: check for valid phone number (up to 20 digits)
      const phone = /^\d{1,20}$/;
      if (!phone.test(customer.phone)) {
        throw new Error('Phone number must contain only digits and be at most 20 characters long.');
      }

      // Validation: check for valid email format
      const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.test(customer.email)) {
        throw new Error('Invalid email format.');
      }

      const [result] = await cnx.query(
        'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?',
        [customer.name, customer.address, customer.email, customer.phone, id]
      );
      if (result.affectedRows === 0) {
        throw new Error(`Customer with ID ${id} not found. Update failed.`);
      }
      return result.affectedRows;
    } catch (error) {
      if (error.message.includes('All fields') || error.message.includes('Phone number') || error.message.includes('Invalid email')) {
        throw error;
      } else {
        console.error(`Error while updating the customer with ID ${id}:`, error);
        throw new Error(`Unable to update customer with ID ${id}. Please check your input.`);
      }
    }
  },

  async delete(id) {
    try {
      const [result] = await cnx.query('DELETE FROM customers WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        throw new Error(`Customer with ID ${id} not found. Deletion failed.`);
      }
      return result.affectedRows;
    } catch (error) {
      console.error(`Error when deleting the customer with ID ${id}:`, error);
      throw new Error(`Unable to delete customer with ID ${id}.`);
    }
  },
};

module.exports = customersModule;
