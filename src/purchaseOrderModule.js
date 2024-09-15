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
      // Vérifiez que l'ID du client est bien un nombre valide
      if (isNaN(order.customer_id)) {
        throw new Error(`Invalid customer ID: ${order.customer_id}. ID must be a number.`);
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
    let connection;
    try {
      connection = await cnx.getConnection();
      await connection.beginTransaction();

      const { date, customer_id, delivery_address, track_number, status } = order;

      const [result] = await connection.query(
        'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
        [date, customer_id, delivery_address, track_number, status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error(`Purchase order with ID ${id} not found.`);
      }

      // Update order details if necessary
      if (order.order_details && order.order_details.length > 0) {
        for (const detail of order.order_details) {
          if (detail.id) {
            // Update an existing detail
            await connection.query(
              'UPDATE order_details SET product_id = ?, quantity = ?, price = ? WHERE id = ? AND order_id = ?',
              [detail.product_id, detail.quantity, detail.price, detail.id, id]
            );
          } else {
            // Adding a new detail
            await connection.query(
              'INSERT INTO order_details (product_id, quantity, price, order_id) VALUES (?, ?, ?, ?)',
              [detail.product_id, detail.quantity, detail.price, id]
            );
          }
        }
      }

      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      if (connection) await connection.rollback();
      console.error(`Error updating purchase order with ID ${id}:`, error);
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
      throw new Error(`Unable to delete purchase order with ID ${id}.`);
    } finally {
      if (connection) connection.release();
    }
  }
}
module.exports = purchaseOrderModule;
