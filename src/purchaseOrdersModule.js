const cnx = require('../database/db');

const purchaseOrdersModule = {
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM purchase_orders');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const [orderRows] = await cnx.query(
        'SELECT * FROM purchase_orders WHERE id = ?', 
        [id]
      );
  
      if (orderRows.length === 0) {
        return null; // Retourne null si la commande n'est pas trouvée
      }
  
      const order = orderRows[0];
  
      const [detailsRows] = await cnx.query(
        'SELECT * FROM order_details WHERE order_id = ?',
        [id]
      );
  
      order.order_details = detailsRows;
  
      return order;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      throw error;
    }
  },

  async create(order) {
    try {
      const { date, customer_id, delivery_address, track_number, status } = order;
      const [result] = await cnx.query(
        'INSERT INTO purchase_orders (date, customer_id, delivery_address, track_number, status) VALUES (?, ?, ?, ?, ?)',
        [date, customer_id, delivery_address, track_number, status]
      );
      return result.insertId; // Retourne l'ID de la commande créée
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  async addOrderDetail(orderDetail) {
    try {
      const result = await cnx.query(
        'INSERT INTO order_details (product_id, quantity, price, order_id) VALUES (?, ?, ?, ?)', 
        [orderDetail.product_id, orderDetail.quantity, orderDetail.price, orderDetail.order_id]
      );
      return result[0].insertId; // Récupère l'ID du détail de commande nouvellement inséré
    } catch (error) {
      console.error('Erreur lors de la création du détail de commande:', error);
      throw error;
    }
  },

  async update(id, order) {
    try {
      const { date, customer_id, delivery_address, track_number, status } = order;
      const [result] = await cnx.query(
        'UPDATE purchase_orders SET date = ?, customer_id = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?',
        [date, customer_id, delivery_address, track_number, status, id]
      );
      return result.affectedRows; // Retourne le nombre de lignes affectées
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  },

  async delete(id) {
    let connection;
    try {
      connection = await cnx.getConnection();
      await connection.beginTransaction();
      
      // Supprimer les détails de la commande
      await connection.query('DELETE FROM order_details WHERE order_id = ?', [id]);
      
      // Supprimer la commande
      const [result] = await connection.query('DELETE FROM purchase_orders WHERE id = ?', [id]);

      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Erreur lors de la suppression de la commande:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  
  
};

module.exports = purchaseOrdersModule;
