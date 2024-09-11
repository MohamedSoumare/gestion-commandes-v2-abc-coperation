const cnx = require('../database/db');

const paymentsModule = {
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM payments');
      return rows;
    } catch (error) {
      console.error('Error retrieving payments:', error);
      throw new Error('Unable to retrieve payments. Please try again later.');
    }
  },

  async getById(id) {
    try {
      const [rows] = await cnx.query('SELECT * FROM payments WHERE id = ?', [id]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error(`Payment with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Error retrieving payment with ID ${id}:`, error);
      throw new Error(`Unable to retrieve payment with ID ${id}.`);
    }
  },

  async create(payment) {
    try {
      const { date, amount, payment_method, order_id } = payment;
      
      // Validate input
      if (!date || !amount || !payment_method || !order_id) {
        throw new Error('All fields (date, amount, payment_method, order_id) are required.');
      }

      const [result] = await cnx.query(
        'INSERT INTO payments (date, amount, payment_method, order_id) VALUES (?, ?, ?, ?)',
        [date, amount, payment_method, order_id]
      );
      return result.insertId; // Returns the created payment ID
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Unable to create payment. Please check your input and try again.');
    }
  },

  async update(id, payment) {
    try {
      const { date, amount, payment_method, order_id } = payment;

      // Validate input
      if (!date || !amount || !payment_method || !order_id) {
        throw new Error('All fields (date, amount, payment_method, order_id) are required.');
      }

      const [result] = await cnx.query(
        'UPDATE payments SET date = ?, amount = ?, payment_method = ?, order_id = ? WHERE id = ?',
        [date, amount, payment_method, order_id, id]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Payment with ID ${id} not found.`);
      }

      return result.affectedRows; // Returns the number of affected rows
    } catch (error) {
      console.error(`Error updating payment with ID ${id}:`, error);
      throw new Error(`Unable to update payment with ID ${id}. Please check the input.`);
    }
  },

  async delete(id) {
    try {
      const [result] = await cnx.query('DELETE FROM payments WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        throw new Error(`Payment with ID ${id} not found.`);
      }

      return result.affectedRows; // Returns the number of deleted rows
    } catch (error) {
      console.error(`Error deleting payment with ID ${id}:`, error);
      throw new Error(`Unable to delete payment with ID ${id}.`);
    }
  }
};

module.exports = paymentsModule;
