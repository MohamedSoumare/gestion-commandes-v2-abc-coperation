const cnx = require('../database/db');

const purchaseOrdersModule = {
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM purchase_orders');
      return rows;
    } catch (error) {
      console.error('Error retrieving purchase orders:', error);
      throw new Error('Unable to retrieve purchase orders. Please try again later.');
    }
  },

  async getById(id) {
    try {
      const [orderRows] = await cnx.query('SELECT * FROM purchase_orders WHERE id = ?', [id]);

      if (orderRows.length === 0) {
        throw new Error(`Purchase order with ID ${id} not found.`);
      }

      const order = orderRows[0];

      const [detailsRows] = await cnx.query('SELECT * FROM order_details WHERE order_id = ?', [id]);
      order.order_details = detailsRows;

      return order;
    } catch (error) {
      console.error(`Error retrieving purchase order with ID ${id}:`, error);
      throw new Error(`Unable to retrieve purchase order with ID ${id}.`);
    }
  },

  async create(data) {
    try {
      // Check if customer exists
      const [customerRows] = await cnx.query('SELECT id FROM customers WHERE id = ?', [data.customer_id]);
      if (customerRows.length === 0) {
        throw new Error(`Customer with ID ${data.customer_id} does not exist.`);
      }

      // Insert the purchase order
      const [result] = await cnx.query(
        'INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)',
        [data.date, data.customer_id, data.delivery_address, data.track_number, data.status]
      );

      return result.insertId; // Returns the newly created purchase order ID
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw new Error('Unable to create purchase order. Please check your input and try again.');
    }
  },

  async addOrderDetail(orderDetail) {
    try {
      const [result] = await cnx.query(
        'INSERT INTO order_details (product_id, quantity, price, order_id) VALUES (?, ?, ?, ?)',
        [orderDetail.product_id, orderDetail.quantity, orderDetail.price, orderDetail.order_id]
      );
      return result.insertId; // Returns the newly inserted order detail ID
    } catch (error) {
      console.error('Error adding order detail:', error);
      throw new Error('Unable to add order detail. Please check your input and try again.');
    }
  },

  async update(id, order) {
    try {
      const { date, customer_id, delivery_address, track_number, status } = order;

      const [result] = await cnx.query(
        'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
        [date, customer_id, delivery_address, track_number, status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Purchase order with ID ${id} not found.`);
      }

      return result.affectedRows; // Returns the number of affected rows
    } catch (error) {
      console.error(`Error updating purchase order with ID ${id}:`, error);
      throw new Error(`Unable to update purchase order with ID ${id}. Please check your input.`);
    }
  },

  async delete(id) {
    let connection;
    try {
      connection = await cnx.getConnection();
      await connection.beginTransaction();

      // Delete order details
      await connection.query('DELETE FROM order_details WHERE order_id = ?', [id]);

      // Delete the purchase order
      const [result] = await connection.query('DELETE FROM purchase_orders WHERE id = ?', [id]);

      await connection.commit();
      if (result.affectedRows === 0) {
        throw new Error(`Purchase order with ID ${id} not found.`);
      }

      return result.affectedRows; // Returns the number of deleted rows
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Error deleting purchase order with ID ${id}:`, error);
      throw new Error(`Unable to delete purchase order with ID ${id}.`);
    } finally {
      if (connection) connection.release(); // Ensure connection is released
    }
  }
};

module.exports = purchaseOrdersModule;
