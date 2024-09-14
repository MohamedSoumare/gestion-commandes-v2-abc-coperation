const readline = require('readline');
const customersModule = require('./src/customersModule');
const productsModule = require('./src/productsModule');
const purchaseOrdersModule = require('./src/purchaseOrdersModule');
const paymentsModule = require('./src/paymentsModule');

// Input interface to capture user inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utility function to ask a question to the user
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Main Menu
async function showMainMenu() {
  console.log('\n------------------- Main Menu ------------------');
  console.log('1. Manage Customers');
  console.log('2. Manage Products');
  console.log('3. Manage Orders');
  console.log('4. Manage Payments');
  console.log('5. Exit');

  const choice = await question('Choose an option: ');
  return choice;
}

// Function to collect customer data
async function getCustomerInput() {
  const name = await question('Customer name: ');
  const address = await question('Address: ');
  const email = await question('Email: ');
  const phone = await question('Phone: ');
  return { name, address, email, phone };
}

// Function to collect product data
async function getProductInput() {
  const name = await question('Product name: ');
  const description = await question('Description: ');
  const stock = await question('Stock: ');
  const price = await question('Price: ');
  const category = await question('Category: ');
  const barcode = await question('Barcode: ');
  const status = await question('Status: ');
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

// Function to collect order data
async function getPurchaseOrderInput() {
 
  const date = await question('Date order (YYYY-MM-DD) : ');
  const customer_id = await question('Customer ID: ');
  const delivery_address = await question('Delivery address: ');
  const track_number = await question('Tracking number: ');
  const status = await question('Status: ');
  return {
    date,
    customer_id: parseInt(customer_id),
    delivery_address,
    track_number,
    status
  };
  
}

// Function to collect order detail data
async function getOrderDetailInput(orderId) {
  const product_id = await question('Product ID: ');
  const product = await productsModule.getById(parseInt(product_id));

  if (!product) {
    console.log("Product ID not found.");
    
  }

  console.log(`Order Price: ${product.price}\n`);
  
  const quantity = await question('Quantity: ');

  // Ensure quantity is a valid number and greater than zero
  if (isNaN(quantity) || parseInt(quantity) <= 0) {
    console.log("Invalid quantity. Please enter a valid number.");
  }

  return { 
    quantity: parseInt(quantity), 
    price: parseFloat(product.price), 
    product_id: product.id, 
    order_id: orderId 
  };
}

// Function to collect payment data
async function getPaymentInput() {
  try {
    const date = await question('Date of payment (YYYY-MM-DD): ');
    const amount = await question('Amount: ');
    const paymentMethod = await question('Payment method: ');
    const orderId = await question('Order ID: ');

    // Validation
    if (!date || !amount || !paymentMethod || !orderId) {
      throw new Error('All fields (date, amount, payment_method, order_id) are required.');
    }

    const payment = {
      date,
      amount: parseFloat(amount), 
      paymentMethod,
      orderId
    };

    await paymentsModule.create(payment);
    console.log('Payment successfully created.');
  } catch (error) {
    console.log('An error occurred:', error.message);
  }
}
// Submenu to manage customers
async function showCustomerMenu() {
  console.log('\n--- Customer Menu ---');
  console.log('1. Add a customer');
  console.log('2. View all customers');
  console.log('3. View a customer by ID');
  console.log('4. Edit a customer');
  console.log('5. Delete a customer');
  console.log('6. Return to main menu');

  const choice = await question('Choose an option: ');
  return choice;
}

// Submenu to manage products
async function showProductMenu() {
  console.log('\n--- Product Menu ---');
  console.log('1. Add a product');
  console.log('2. View all products');
  console.log('3. View a product by ID');
  console.log('4. Edit a product');
  console.log('5. Delete a product');
  console.log('6. Return to main menu');

  const choice = await question('Choose an option: ');
  return choice;
}

// Submenu to manage orders
async function showOrderMenu() {
  console.log('\n--- Order Menu ---');
  console.log('1. Create an order');
  console.log('2. View all orders');
  console.log('3. View an order by ID');
  console.log('4. Edit an order');
  console.log('5. Delete an order');
  console.log('6. Return to main menu');

  const choice = await question('Choose an option: ');
  return choice;
}

// Submenu to manage payments
async function showPaymentMenu() {
  console.log('\n--- Payment Menu ---');
  console.log('1. Add a payment');
  console.log('2. View all payments');
  console.log('3. View a payment by ID');
  console.log('4. Edit a payment');
  console.log('5. Delete a payment');
  console.log('6. Return to main menu');

  const choice = await question('Choose an option: ');
  return choice;
}

// Customer management
async function handleCustomers() {
  let customerManaging = true;
  while (customerManaging) {
    try {
      const choice = await showCustomerMenu();
      switch (choice) {
        case '1':
          const customerData = await getCustomerInput();
          await customersModule.create(customerData);
          console.log('Customer successfully added.');
          break;
        case '2':
          const customers = await customersModule.getAll();
          console.log('Customers:', customers);
          break;
        case '3':
          const customerId = await question('ID of the customer to view: ');
          const customer = await customersModule.getById(parseInt(customerId));
          customer ? console.log('Customer:', customer) : console.log('No customer found.');
          break;
        case '4':
          const customerIdUpdate = await question('ID of the customer to edit: ');
          const updatedCustomerData = await getCustomerInput();
          const updatedCustomer = await customersModule.update(parseInt(customerIdUpdate), updatedCustomerData);
          console.log(updatedCustomer > 0 ? 'Customer successfully updated.' : 'No customer found.');
          break;
        case '5':
          const customerIdDelete = await question('ID of the customer to delete: ');
          const deletedCustomer = await customersModule.delete(parseInt(customerIdDelete));
          console.log(deletedCustomer > 0 ? 'Customer successfully deleted.' : 'No customer found.');
          break;
        case '6':
          customerManaging = false;
          break;
        default:
          console.log('Invalid option. Please try again.');
      }
    } catch (error) {
       //Displays only the error message without the stack trace
      console.log(`An error occurred: ${error.message}`);
    }
  }
}
// Product management
async function handleProducts() {
  let productManaging = true;
  while (productManaging) {
    const choice = await showProductMenu();
    switch (choice) {
      case '1':
        const productData = await getProductInput();
        await productsModule.create(productData);
        console.log('Product successfully added.');
        break;
      case '2':
        const products = await productsModule.getAll();
        console.log('Products:', products);
        break;
        case '3':
          const productIdGet = await question('ID of the product to view: ');
          const product = await productsModule.getById(parseInt(productIdGet));
          if (product) {
            console.log('Product:', product);
          } else {
            console.log(`No product found with ID ${productIdGet}.`);
          }
          break;
        
          case '4':
            const productIdToUpdate = await question('ID of the product to edit: ');
            const updatedProductData = await getProductInput();
          
            // Vérifiez que les champs obligatoires sont remplis avant de procéder à la mise à jour
            if (!updatedProductData.name || !updatedProductData.description || !updatedProductData.stock || 
                !updatedProductData.price || !updatedProductData.category || 
                !updatedProductData.barcode || !updatedProductData.status) {
              console.log('Error: All fields (name, description, stock, price, category, barcode, status) are required.');
            } else {
              const updatedProduct = await productsModule.update(parseInt(productIdToUpdate), updatedProductData);
              console.log(updatedProduct > 0 ? 'Product successfully updated.' : 'No product found.');
            }
            break;
          
            case '5':
              const productIdDelete = await question('ID of the product to delete: ');
              try {
                const deletedProduct = await productsModule.delete(parseInt(productIdDelete));
                console.log(deletedProduct > 0 ? 'Product successfully deleted.' : 'No product found.');
              } catch (error) {
                console.log(`An error occurred: ${error.message}`);
              }
              break;
            
      case '6':
        productManaging = false;
        break;
      default:
        console.log('Invalid option. Please try again.');
    }
  }
}

// Order management
async function handlePurchaseOrders() {
  let orderManaging = true;
  let currentOrder = null; // Temporarily stores the order
  let orderDetails = [];   // Temporarily stores order details

  while (orderManaging) {
    const choice = await showOrderMenu();

    switch (choice) {
      case '1': // Create new order

        const orderData = await getPurchaseOrderInput();
        const customerExists = await customersModule.getById(orderData.customer_id);

        // Validation de l'ID du client
        if (isNaN(orderData.customer_id) || !orderData.customer_id) {
          console.log('Invalid customer ID. Please provide a valid customer ID.');
          break;
        }

        if (!customerExists) {
          console.log('Client not found. Please first create the client.');
          break;
        }

        currentOrder = orderData; // Temporary storage of order data
        orderDetails = []; // Reset the order details

        console.log('The order data is saved. You can now add details');

        let addingDetails = true;
        while (addingDetails) {
          console.log('\n--- Order Details Menu ---');
          console.log('1. Add an order detail');
          console.log('2. Save and exit');
          console.log('3. Exit without saving');
          const detailChoice = await question('Choose an option :');

          switch (detailChoice) {
            case '1': // Add order detail
              const orderDetail = await getOrderDetailInput();
              if (orderDetail) {
                orderDetails.push(orderDetail); // Adds detail in temporary table
                console.log('Order detail added');
              }
              break;

            case '2': // Save to database

              if (currentOrder) {
                try {
                 // Save the order first
                  const orderId = await purchaseOrdersModule.create(currentOrder);
                  console.log('Command successfully saved. ID:', orderId);

                  // Save order details in database
                  for (const detail of orderDetails) {
                    detail.order_id = orderId; // Assigns the order ID to each detail
                    await purchaseOrdersModule.addOrderDetail(detail);
                  }
                  console.log('Order details saved successfully.');
                } catch (error) {
                  console.error('Error saving order or details:', error);
                }
              } else {
                console.log('No orders to save.');
              }
              addingDetails = false;
              break;

            case '3': // Exit without saving
              currentOrder = null; // Reset temporary command data
              orderDetails = [];   // Réinitialiser les détails de commande temporaires
              console.log('Order creation cancelled.');
              addingDetails = false;
              break;

            default:
              console.log('Invalid option. Please try again.');
          }
        }
        break;

        case '2': 
        const orders = await purchaseOrdersModule.getAll(); 
        console.log('Orders:', orders);
        break;

        case '3': 
        const orderId = parseInt(await question('Order ID to be viewed:'));
        
        // Validation de l'ID de la commande
        if (isNaN(orderId) || orderId <= 0) {
          console.log('Invalid order ID. Please provide a valid order ID.');
          break;
        }
      
        const order = await purchaseOrdersModule.getById(orderId);
        console.log(order ? 'Order:' : 'No orders found.', order);
        break;
      
      case '4': // Edit an order
        const orderIdUpdate = await question('The ID of the command to be modified: ');
        // Validation de l'ID de la commande
  if (isNaN(orderIdUpdate) || orderIdUpdate <= 0) {
    console.log('Invalid order ID. Please provide a valid order ID.');
    break;
  }

        let updatedOrderData = await getPurchaseOrderInput();


        let editingDetails = true;
        while (editingDetails) {
          
          console.log('\n--- Edit Order Details ---');
          console.log('1. View current details');
          console.log('2. Add a new order detail');
          console.log('3. Edit an existing detail');
          console.log('4. Save changes and exit');
          console.log('5. Cancel changes and exit');
          

          const detailChoice = await question('Choose an option :');

          switch (detailChoice) {
            case '1': // View current order details
              const currentDetails = await purchaseOrdersModule.getOrderDetails(orderIdUpdate);
              console.log('Current order details :', currentDetails);
              break;

            case '2': // Add new order detai
              const newDetail = await getOrderDetailInput(orderIdUpdate);
              if (newDetail) {
                if (!updatedOrderData.order_details) {
                  updatedOrderData.order_details = [];
                }
                updatedOrderData.order_details.push(newDetail);
                console.log('New order detail added.');
              }
              break;

            case '3': // Edit an existing detail
              const detailIdToEdit = await question('ID of the detail to modify: ');
              const updatedDetail = await getOrderDetailInput(orderIdUpdate);
              if (updatedDetail) {
                updatedDetail.id = parseInt(detailIdToEdit);
                if (!updatedOrderData.order_details) {
                  updatedOrderData.order_details = [];
                }
                updatedOrderData.order_details.push(updatedDetail);
                console.log('Order detail updated.');
              }
              break;

            case '4': // Save the changes
              editingDetails = false;
              break;

            case '5': // Exit without saving
              editingDetails = false;
              updatedOrderData = null; // Undo changes
              break;

            default:
              console.log('Invalid option. Please try again.');
          }
        }

        if (updatedOrderData) {
          try {
            const updatedOrder = await purchaseOrdersModule.update(parseInt(orderIdUpdate), updatedOrderData);
            console.log('Order updated successfully.');
          } catch (error) {
            console.error('Error while updating the command :', error.message);
          }
        } else {
          console.log('Change of cancelled order.');
        }
        break;

      case '5':
        case '5':
          const orderIdDelete = parseInt(await question('ID of the order to delete: '));
          
          // Validation de l'ID de la commande
          if (isNaN(orderIdDelete) || orderIdDelete <= 0) {
            console.log('Invalid order ID. Please provide a valid order ID.');
            break;
          }
        
          const deletedOrder = await purchaseOrdersModule.delete(orderIdDelete);
          console.log(deletedOrder > 0 ? 'Order successfully deleted.' : 'No order found.');
          break;
        
      case '6': 
        orderManaging = false;
        break;

      default:
        console.log('Invalid option. Please try again.');
    }
  }
}

// Payment management
async function handlePayments() {
  let paymentManaging = true;
  while (paymentManaging) {
    const choice = await showPaymentMenu();
    try {
      switch (choice) {
        case '1':
          const paymentData = await getPaymentInput();
          await paymentsModule.create(paymentData);
          console.log('Payment successfully added.');
          break;
        case '2':
          const payments = await paymentsModule.getAll();
          console.log('Payments:', payments);
          break;
          case '3':
            const paymentIdGet = await question('ID of the payment to view: ');
            try {
              const payment = await paymentsModule.getById(parseInt(paymentIdGet));
              if (payment) {
                console.log('Payment:', payment);
              } else {
                console.log(`No payment found with ID ${paymentIdGet}`);
              }
            } catch (error) {
              console.log('An error occurred:', error.message); 
            }
            break;
          
          case '4':
          const paymentIdUpdate = await question('ID of the payment to edit: ');
          try {
            const updatedPaymentData = await getPaymentInput();
            const updatedPayment = await paymentsModule.update(parseInt(paymentIdUpdate), updatedPaymentData);
            console.log(updatedPayment > 0 ? 'Payment successfully updated.' : 'No payment found.');
          } catch (error) {
            console.log('An error occurred:', error.message);  // Affiche uniquement le message d'erreur
          }
          break;
        case '5':
          const paymentIdDelete = await question('ID of the payment to delete: ');
          const deletedPayment = await paymentsModule.delete(parseInt(paymentIdDelete));
          console.log(deletedPayment > 0 ? 'Payment successfully deleted.' : 'No payment found.');
          break;
        case '6':
          paymentManaging = false;
          break;
        default:
          console.log('Invalid option. Please try again.');
      }
    } catch (error) {
      console.log('An error occurred:', error.message);  // N'affiche que le message d'erreur
    }
  }
}



async function main() {
  let exit = false;
  while (!exit) {
    const choice = await showMainMenu();

    switch (choice) {
      case '1':
        await handleCustomers();
        break;
      case '2':
        await handleProducts();
        break;
      case '3':
        await handlePurchaseOrders(); 
        break;
      case '4':
        await handlePayments();
        break;
      case '5':
        console.log('Exiting the system...');
        exit = true;
        rl.close(); // Close the readline interface when exiting
        break;
      default:
        console.log('Invalid option. Please try again.');
    }
  }
}

// Run the main program
main().catch(err => console.error('An unexpected error occurred:', err));
