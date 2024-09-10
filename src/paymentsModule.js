const cnx = require('../database/db');

const paymentsModule = {
  async getAll() {
    try {
      const [rows] = await cnx.query('SELECT * FROM payments');
      return rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const [rows] = await cnx.query('SELECT * FROM payments WHERE id = ?', [id]);
      return rows.length > 0 ? rows[0] : null; // Retourne null si aucun paiement n'est trouvé
    } catch (error) {
      console.error(`Erreur lors de la récupération du paiement avec l'ID ${id}:`, error);
      throw error;
    }
  },

  async create(payment) {
    try {
      const { date, amount, payment_method, order_id } = payment;
      const [result] = await cnx.query(
        'INSERT INTO payments (date, amount, payment_method, order_id) VALUES (?, ?, ?, ?)',
        [date, amount, payment_method, order_id]
      );
      return result.insertId; // Retourne l'ID du paiement créé
    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      throw error;
    }
  },

  async update(id, payment) {
    try {
      const { date, amount, payment_method, order_id } = payment;
      const [result] = await cnx.query(
        'UPDATE payments SET date = ?, amount = ?, payment_method = ?, order_id = ? WHERE id = ?',
        [date, amount, payment_method, order_id, id]
      );
      return result.affectedRows; // Retourne le nombre de lignes affectées
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du paiement avec l'ID ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const [result] = await cnx.query('DELETE FROM payments WHERE id = ?', [id]);
      return result.affectedRows; // Retourne le nombre de lignes supprimées
    } catch (error) {
      console.error(`Erreur lors de la suppression du paiement avec l'ID ${id}:`, error);
      throw error;
    }
  }
};

module.exports = paymentsModule;
