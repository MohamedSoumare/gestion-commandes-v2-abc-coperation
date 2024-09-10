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
      const [rows] = await cnx.query(
        'SELECT po.*, od.product_id, od.quantity, od.price FROM purchase_orders po LEFT JOIN order_details od ON po.id = od.order_id WHERE po.id = ?', 
        [id]
      );
      return rows.length > 0 ? rows : null; // Récupère la commande avec ses détails
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

  // Suppression de la commande et de ses détails associés
  async delete(id) {
    try {
      await cnx.beginTransaction(); // Démarrer une transaction
      
      // Supprimer les détails de la commande
      await cnx.query('DELETE FROM order_details WHERE order_id = ?', [id]);
      
      // Supprimer la commande
      const [result] = await cnx.query('DELETE FROM purchase_orders WHERE id = ?', [id]);
  
      await cnx.commit(); // Committer la transaction si tout va bien
      return result.affectedRows;
    } catch (error) {
      await cnx.rollback(); // Annuler la transaction en cas d'erreur
      console.error('Erreur lors de la suppression de la commande:', error);
      throw error;
    }
  }
  
};

module.exports = purchaseOrdersModule;
