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
      // Validation : Vérifier si tous les champs sont remplis
      if (!order.date || !order.customer_id || !order.delivery_address || !order.track_number || !order.status) {
          throw new Error('All fields are required. Please fill in all fields.');
      }

      // Validation : Vérifier si le customer_id est un nombre
      if (isNaN(order.customer_id)) {
          throw new Error('Invalid client ID. Please enter a valid client ID.');
      }

      // Vérifier si le client existe
      const [customerRows] = await cnx.query('SELECT id FROM customers WHERE id = ?', [order.customer_id]);

      if (customerRows.length === 0) {
          // Client n'existe pas
          throw new Error('The customer does not exist. Please provide a valid customer ID.');
      }

      // Insérer la commande
      const [result] = await cnx.query(
          'INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)',
          [order.date, order.customer_id, order.delivery_address, order.track_number, order.status]
      );

      return result.insertId; // Retourner l'ID de la commande créée
  } catch (error) {
      // Afficher un message d'erreur sans trace
      if (error.message.includes('does not exist')) {
          console.log(error.message); // Affiche un message utilisateur simple
      } else {
          console.error('Error when creating the order:', error.message); // Pour le débogage interne
      }
      throw new Error('Unable to create order. Please check your data and try again.');
  }
},
  
async addOrderDetail(orderDetail) {
  let connection;
  try {
    connection = await cnx.getConnection();
    await connection.beginTransaction();

    // Vérifier si le produit existe
    const [productRows] = await connection.query(
      'SELECT id FROM products WHERE id = ?',
      [orderDetail.product_id]
    );
    if (productRows.length === 0) {
      throw new Error(`Product with ID ${orderDetail.product_id} does not exist.`);
    }

    // Insérer les détails de la commande
    const [result] = await connection.query(
      'INSERT INTO order_details (product_id, quantity, price, order_id) VALUES (?, ?, ?, ?)',
      [orderDetail.product_id, orderDetail.quantity, orderDetail.price, orderDetail.order_id]
    );

    await connection.commit();
    return result.insertId; // Return the ID of the newly inserted order detail
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error adding order detail:', error);
    throw new Error('Unable to add order detail. Please check your input and try again.');
  } finally {
    if (connection) connection.release();
  }
},
async update(id, order) {
  let connection;
  try {
    connection = await cnx.getConnection();
    await connection.beginTransaction();

    // Vérifier si l'ID est un nombre valide
    if (isNaN(id)) {
      throw new Error('Invalid order ID. Please provide a valid numeric ID.');
    }

    // Vérifier si la commande existe
    const [existingOrder] = await connection.query(
      'SELECT id FROM purchase_orders WHERE id = ?',
      [id]
    );

    if (existingOrder.length === 0) {
      throw new Error(`Purchase order with ID ${id} not found.`);
    }

    // Vérifier si le nouveau numéro de suivi (track_number) est déjà utilisé par une autre commande
    const [existingTrack] = await connection.query(
      'SELECT id FROM purchase_orders WHERE track_number = ? AND id != ?',
      [order.track_number, id]
    );

    if (existingTrack.length > 0) {
      throw new Error(`Track number ${order.track_number} is already used by another order. Please provide a unique track number.`);
    }

    const { date, customer_id, delivery_address, track_number, status } = order;

    // Mise à jour de la commande dans la base de données
    const [result] = await connection.query(
      'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
      [date, customer_id, delivery_address, track_number, status, id]
    );

    if (result.affectedRows === 0) {
      throw new Error(`Purchase order with ID ${id} not found.`);
    }

    await connection.commit();
    console.log(`Purchase order with ID ${id} updated successfully.`);
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
