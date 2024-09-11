const readline = require('readline');
const customersModule = require('./src/customersModule');
const productsModule = require('./src/productsModule');
const purchaseOrdersModule = require('./src/purchaseOrdersModule');
const paymentsModule = require('./src/paymentsModule');

// Interface de lecture pour saisir les inputs de l'utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  // Fonction utilitaire pour poser une question à l'utilisateur
  function question(query) {
    return new Promise((resolve) => {
      rl.question(query, resolve);
    });
  }


  async function showMenu() {
    console.log('\n------------------- Menu ------------------');
    console.log('1. Ajouter un client');
    console.log('2. Afficher tous les clients');
    console.log('3. Afficher un client par ID');
    console.log('4. Modifier un client');
    console.log('5. Supprimer un client');
    console.log('6. Ajouter un produit');
    console.log('7. Afficher tous les produits');
    console.log('8. Afficher un produit par ID');
    console.log('9. Modifier un produit');
    console.log('10. Supprimer un produit');
    console.log('11. Créer une commande');
    console.log('12. Afficher toutes les commandes');
    console.log('13. Afficher une commande par ID');
    console.log('14. Modifier une commande');
    console.log('15. Supprimer une commande');
    console.log('16. Ajouter un paiement');
    console.log('17. Afficher tous les paiements');
    console.log('18. Afficher un paiement par ID');
    console.log('19. Modifier un paiement');
    console.log('20. Supprimer un paiement');
    console.log('21. Quitter');
  
    const choice = await question('Choisissez une option : ');
    return choice;
  }
  
  
// Input functions to retrieve user data
async function getCustomerInput() {
    const name = await question('Nom du client : ');
    const address = await question('Adresse : ');
    const email = await question('Email : ');
    const phone = await question('Téléphone : ');
    return { name, address, email, phone };
  }
  
  async function getProductInput() {
    const name = await question('Nom du produit : ');
    const description = await question('Description : ');
    const stock = await question('Stock : ');
    const price = await question('Prix : ');
    const category = await question('Catégorie : ');
    const barcode = await question('Code-barres : ');
    const status = await question('Statut : ');
    return {
      name,
      description,
      stock: parseInt(stock),
      price: parseFloat(price),
      category,
      barcode,
      status,
    };
  }
  
  async function getPurchaseOrderInput() {
    const customer_id = await question('ID du client : ');
    const delivery_address = await question('Adresse de livraison : ');
    const track_number = await question('Numéro de suivi : ');
    const status = await question('Statut : ');
    return { date: new Date(), customer_id: parseInt(customer_id), delivery_address, track_number, status };
  }
  
  async function getOrderDetailInput(orderId) {
    const product_id = await question('ID du produit : ');
    const product = await productsModule.getById(parseInt(product_id));
    
    if (!product) {
      console.log("ID du produit non trouvé.");
      return null;
    }
  
    if (!product.price || isNaN(product.price)) {
      console.log("Le produit sélectionné n'a pas de prix valide.");
      return null;
    }
  
    console.log(`Prix du commande : ${product.price}\n`);  
    const quantity = await question('Quantité : ');
  
    if (isNaN(quantity) || parseInt(quantity) <= 0) {
      console.log("Quantité invalide. Veuillez saisir un nombre valide.");
      return null;
    }
  
    return { 
      quantity: parseInt(quantity), 
      price: parseFloat(product.price), 
      product_id: product.id, 
      order_id: orderId 
    };
  }
  
  async function getPaymentInput() {
    const amount = await question('Montant : ');
    const payment_method = await question('Méthode de paiement : ');
    const order_id = await question('ID de la commande : ');
    return {
      date: new Date(),
      amount: parseFloat(amount),
      payment_method,
      order_id: parseInt(order_id),
    };
  }
  
  
// Menu for order details
async function showOrderDetailMenu() {
    console.log('\n--- Menu Détails de Commande ---');
    console.log('1. Ajouter un détail de commande');
    console.log('2. Sauvegarder et quitter');
  
    const choice = await question('Choisissez une option : ');
    return choice;
}


// Order Details Management
async function handleOrderDetails(orderId) {
    let orderAdding = true;
  
    while (orderAdding) {
      const choice = await showOrderDetailMenu();
  
      switch (choice) {
        case '1':
          const orderDetailData = await getOrderDetailInput(orderId);
          if (orderDetailData) {
            await purchaseOrdersModule.addOrderDetail(orderDetailData);
            console.log('Détail de commande ajouté avec succès.');
          }
          break;
  
        case '2': // Sauvegarder et quitter
          console.log('Sauvegarde des détails de commande et retour au menu principal.');
          orderAdding = false;
          break;
  
        default:
          console.log('Option invalide. Veuillez choisir à nouveau.');
      }
    }
}



async function main() {
    try {
        
        let current = true;
        while (current) {
    
        const choice = await showMenu();

        switch (choice) {
          // Gestion des clients
          case '1':
            const customerData = await getCustomerInput();
            await customersModule.create(customerData);
            console.log('Client ajouté avec succès.');
            break;
  
          case '2':
            const customers = await customersModule.getAll();
            console.log('Clients :', customers);
            break;
  
          case '3':
            
            const customerId = await question('ID du client à afficher : ');
            const customer = await customersModule.getById(parseInt(customerId));
            customer ? console.log('Client :', customer) : console.log('Aucun client trouvé.');
            break;
  
          case '4':

            const customerUpdate = await question('ID du client à modifier : ');
            const updatedCustomerData = await getCustomerInput();
            const updatedCustomer = await customersModule.update(parseInt(customerUpdate), updatedCustomerData);
            console.log(updatedCustomer > 0 ? 'Client mis à jour avec succès.' : 'Aucun client trouvé.');
            break;
  
          case '5':
            const customerIdToDelete = await question('ID du client à supprimer : ');
            const deletedCustomer = await customersModule.delete(parseInt(customerIdToDelete));
            console.log(deletedCustomer > 0 ? 'Client supprimé avec succès.' : 'Aucun client trouvé.');
            break;
  
          // Gestion des produits
          case '6':
            const productData = await getProductInput();
            await productsModule.create(productData);
            console.log('Produit ajouté avec succès.');
            break;
  
          case '7':
            const products = await productsModule.getAll();
            console.log('Produits :', products);
            break;
  
          case '8':
            const productIdToGet = await question('ID du produit à afficher : ');
            const product = await productsModule.getById(parseInt(productIdToGet));
            console.log(product ? 'Produit :' : 'Aucun produit trouvé.', product);
            break;
  
          case '9':
            const productIdToUpdate = await question('ID du produit à modifier : ');
            const updatedProductData = await getProductInput();
            const updatedProduct = await productsModule.update(parseInt(productIdToUpdate), updatedProductData);
            console.log(updatedProduct > 0 ? 'Produit mis à jour avec succès.' : 'Aucun produit trouvé avec cet ID.');
            break;
  
          case '10':
            const productIdToDelete = await question('ID du produit à supprimer : ');
            const deletedProduct = await productsModule.delete(parseInt(productIdToDelete));
            console.log(deletedProduct > 0 ? 'Produit supprimé avec succès.' : 'Aucun produit trouvé.');
            break;
  
            case '11': // Créer une commande
            const orderData = await getPurchaseOrderInput();
            const orderId = await purchaseOrdersModule.create(orderData); 
            console.log('Commande créée avec succès.');
            await handleOrderDetails(orderId); // Passe l'ID de la commande à la fonction
            break;
          
        
          case '12':
            const orders = await purchaseOrdersModule.getAll();
            console.log('Commandes :', orders);
            break;
  
            case '13':
                const orderGet = await question('ID de la commande à afficher : ');
                const order = await purchaseOrdersModule.getById(parseInt(orderGet));
                if (order) {
                    console.log('Commande :');
                    console.log(`ID: ${order.id}`);
                    console.log(`Date: ${order.date}`);
                    console.log(`Client ID: ${order.customer_id}`);
                    console.log(`Adresse de livraison: ${order.delivery_address}`);
                    console.log(`Numéro de suivi: ${order.track_number}`);
                    console.log(`Statut: ${order.status}`);
                    console.log('Détails de la commande :');
                    
                    if (order.order_details && order.order_details.length > 0) {
                    for (const detail of order.order_details) {
                        console.log(`- Produit ID: ${detail.product_id}, Quantité: ${detail.quantity}, Prix: ${detail.price}`);
                    }
                    } else {
                    console.log('Aucun détail de commande trouvé.');
                    }
                } else {
                    console.log('Aucune commande trouvée.');
                }
                break;
  
          case '14':
            const orderIdToUpdate = await question('ID de la commande à modifier : ');
            const updatedOrderData = await getPurchaseOrderInput();
            const updatedOrder = await purchaseOrdersModule.update(parseInt(orderIdToUpdate), updatedOrderData);
            console.log(updatedOrder > 0 ? 'Commande mise à jour avec succès.' : 'Aucune commande trouvée.');
            break;
  
          case '15':
            const orderDelete = await question('ID de la commande à supprimer : ');
            const deletedOrder = await purchaseOrdersModule.delete(parseInt(orderDelete));
            console.log(deletedOrder > 0 ? 'Commande supprimée avec succès.' : 'Aucune commande trouvée.');
            break;
  
          // Gestion des paiements
          case '16':
            const paymentData = await getPaymentInput();
            await paymentsModule.create(paymentData);
            console.log('Paiement ajouté avec succès.');
            break;
  
          case '17':
            const payments = await paymentsModule.getAll();
            console.log('Paiements :', payments);
            break;
  
          case '18':
            const paymentIdToGet = await question('ID du paiement à afficher : ');
            const payment = await paymentsModule.getById(parseInt(paymentIdToGet));
            console.log(payment ? 'Paiement :' : 'Aucun paiement trouvé.', payment);
            break;
  
          case '19':
            const paymentIdToUpdate = await question('ID du paiement à modifier : ');
            const updatedPaymentData = await getPaymentInput();
            const updatedPayment = await paymentsModule.update(parseInt(paymentIdToUpdate), updatedPaymentData);
            console.log(updatedPayment > 0 ? 'Paiement mis à jour avec succès.' : 'Aucun paiement trouvé.');
            break;
  
          case '20':
            const paymentIdToDelete = await question('ID du paiement à supprimer : ');
            const deletedPayment = await paymentsModule.delete(parseInt(paymentIdToDelete));
            console.log(deletedPayment > 0 ? 'Paiement supprimé avec succès.' : 'Aucun paiement trouvé.');
            break;
  
          // Quitter l'application
          case '21':
            console.log('Merci.');
            current = false;
            break;
  
          default:
            console.log('Option invalide. Veuillez réessayer.');
        }
      }
    } finally {
      rl.close(); 
    }
  }
  
  main();
  