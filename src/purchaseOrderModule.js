const cnx = require('../database/db');

const purchaseOrderModule = {
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
        // Check if the ID is a valid number
        if (isNaN(id)) {
            throw new Error(`Invalid purchase order ID: ${id}. ID must be a number.`);
        }

        // Query the purchase_orders table to find the order by ID
        const [orderRows] = await cnx.query('SELECT * FROM purchase_orders WHERE id = ?', [id]);

        // Check if the purchase order was found
        if (orderRows.length === 0) {
            throw new Error(`Purchase order with ID ${id} not found.`);
        }

        // Extract the order from the result set
        const order = orderRows[0];

        // Query the order_details table to retrieve the details for the specific order
        const [detailsRows] = await cnx.query('SELECT * FROM order_details WHERE order_id = ?', [id]);
        
        // Attach the order details to the main order object
        order.order_details = detailsRows;

        // Return the final order object with all details
        return order;

    } catch (error) {
        // Log the detailed error internally for debugging purposes
        console.error(`Error retrieving purchase order with ID ${id}: ${error.message}`);

        // Throw a user-friendly message without the error trace
        throw new Error(`Unable to retrieve purchase order with ID ${id}. Please make sure the ID is correct.`);
    }
},


async create(order) {
  try {
        // Check if the track_number already exists
        const [existingTrack] = await cnx.query(
            'SELECT id FROM purchase_orders WHERE track_number = ?',
            [order.track_number]
        );
        
        if (existingTrack.length > 0) {
            throw new Error(`Track number ${order.track_number} already exists. Please provide a unique track number.`);
        }
        
        // Check if customer exists
        const [customerRows] = await cnx.query('SELECT id FROM customers WHERE id = ?', [order.customer_id]);
        
        if (customerRows.length === 0) {
            throw new Error(`Customer with ID ${order.customer_id} does not exist.`);
        }

        // Insert the purchase order
        const [result] = await cnx.query(
            'INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)',
            [order.date, order.customer_id, order.delivery_address, order.track_number, order.status]
        );

      return result.insertId;
  } catch (error) {
      console.error('Error creating purchase order:', error.message);
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
    let connection;
    try {
        connection = await cnx.getConnection();
        await connection.beginTransaction();

        // Check if the new track_number is already in use by another order
        const [existingTrack] = await connection.query(
            'SELECT id FROM purchase_orders WHERE track_number = ? AND id != ?',
            [order.track_number, id]
        );

        if (existingTrack.length > 0) {
            throw new Error(`Track number ${order.track_number} is already used by another order. Please provide a unique track number.`);
        }

        const { date, customer_id, delivery_address, track_number, status } = order;

        const [result] = await connection.query(
            'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
            [date, customer_id, delivery_address, track_number, status, id]
        );

        if (result.affectedRows === 0) {
            throw new Error(`Purchase order with ID ${id} not found.`);
        }

       
        await connection.commit();
        return result.affectedRows;
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(`Error updating purchase order with ID ${id}:`, error.message);
        throw new Error(`Unable to update purchase order with ID ${id}. Please check your input.`);
    } finally {
        if (connection) connection.release();
    }
},

  async getOrderDetails(orderId) {
    try {
      const [rows] = await cnx.query('SELECT * FROM order_details WHERE order_id = ?', [orderId]);
      return rows;
    } catch (error) {
      console.error(`Error retrieving order details for order ID ${orderId}:`, error);
      throw new Error(`Unable to retrieve order details for order ID ${orderId}.`);
    }
  },


  async updateOrderDetail(detailId, order) {
    try {
      const [result] = await cnx.query(
        'UPDATE order_details SET product_id = ?, quantity = ?, price = ? WHERE id = ?',
        [order.product_id, order.quantity, order.price, detailId]
      );
      if (result.affectedRows === 0) {
        throw new Error(`Order detail with ID ${detailId} not found.`);
      }
      return result.affectedRows;
    } catch (error) {
      console.error(`Error updating order detail with ID ${detailId}:`, error);
      throw new Error(`Unable to update order detail with ID ${detailId}. Please check your input.`);
    }
  },

async delete(id) {
    let connection;
    try {
        connection = await cnx.getConnection();
        await connection.beginTransaction();

        // Check if the order has been paid
        const [payments] = await connection.query(
            'SELECT * FROM payments WHERE order_id = ?',
            [id]
        );

        if (payments.length > 0) {
            throw new Error('This order has already been paid and cannot be deleted.');
        }

        // Delete the order details first
        await connection.query('DELETE FROM order_details WHERE order_id = ?', [id]);

        // Then delete the order itself
        const [result] = await connection.query('DELETE FROM purchase_orders WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            throw new Error(`Purchase order with ID ${id} not found.`);
        }

        await connection.commit();
        return result.affectedRows;
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error deleting purchase order:', error.message);
        throw new Error(error.message); // Return the error message about payment if applicable
    } finally {
        if (connection) connection.release();
    }
 },

}
module.exports = purchaseOrderModule;
