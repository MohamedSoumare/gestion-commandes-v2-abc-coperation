const cnx = require('../database/db');

const paymentModule = {
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
      if (rows.length === 0) {
        throw new Error(`Payment with ID ${id} not found`);
      }
      return rows[0];
    } catch (error) {
      console.error('Error retrieving payment:', error.message);
      throw new Error(`Unable to retrieve payment with ID ${id}`);
    }
  },

  async create(payment) {
    const { date, amount, payment_method, order_id } = payment;

    // Check for required fields
    if (!date || !amount || !payment_method || !order_id) {
      throw new Error('All fields (date, amount, payment_method, order_id) are required.');
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number.');
    }

    try {
      // Check if the order exists
      const [orderRows] = await cnx.query('SELECT id FROM purchase_orders WHERE id = ?', [order_id]);
      if (orderRows.length === 0) {
        throw new Error(`Order with ID ${order_id} does not exist.`);
      }

      // Insert the payment
      const [result] = await cnx.query(
        'INSERT INTO payments (date, amount, payment_method, order_id) VALUES (?, ?, ?, ?)',
        [date, amount, payment_method, order_id]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error creating payment:', error.message);
      throw new Error('An error occurred while creating the payment.');
    }
  },

  async update(id, payment) {
    const { date, amount, payment_method, order_id } = payment;

    // Check for required fields
    if (!date || amount === undefined || !payment_method || order_id === undefined) {
      throw new Error('All fields (date, amount, payment_method, order_id) are required.');
    }

    try {
      // Check if the payment exists
      const [paymentCheck] = await cnx.query('SELECT * FROM payments WHERE id = ?', [id]);
      if (paymentCheck.length === 0) {
        throw new Error(`Payment with ID ${id} not found.`);
      }

      // Check if the order exists
      const [orderCheck] = await cnx.query('SELECT id FROM purchase_orders WHERE id = ?', [order_id]);
      if (orderCheck.length === 0) {
        throw new Error(`Order with ID ${order_id} does not exist.`);
      }

      // Update the payment
      const [result] = await cnx.query(
        'UPDATE payments SET date = ?, amount = ?, payment_method = ?, order_id = ? WHERE id = ?',
        [date, amount, payment_method, order_id, id]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Payment with ID ${id} not found.`);
      }

      return result.affectedRows;
    } catch (error) {
      console.error(`Error updating payment with ID ${id}:`, error.message);
      throw new Error('An error occurred while updating the payment.');
    }
  },

  async delete(id) {
    try {
      const [result] = await cnx.query('DELETE FROM payments WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        throw new Error(`Payment with ID ${id} not found.`);
      }
      return result.affectedRows;
    } catch (error) {
      console.error(`Error deleting payment with ID ${id}:`, error.message);
      throw new Error('Unable to delete payment. Please try again later.');
    }
  }
};

module.exports = paymentModule;