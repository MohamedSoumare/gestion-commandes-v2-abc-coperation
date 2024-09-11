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
  const date = new Date();  
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

async function getOrderDetailInput(orderId) {
  const product_id = await question('Product ID: ');
  const product = await productsModule.getById(parseInt(product_id));

  if (!product) {
    console.log("Product ID not found.");
  }

  console.log(`Order Price: ${product.price}\n`);  
  const quantity = await question('Quantity: ');

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
  const date = new Date();
  const amount = await question('Amount: ');
  const payment_method = await question('Payment method: ');
  const order_id = await question('Order ID: ');
  return {
    date, 
    amount: parseFloat(amount),
    payment_method,
    order_id: parseInt(order_id),
  };
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
        console.log(product ? 'Product:' : 'No product found.', product);
        break;
      case '4':
        const productIdToUpdate = await question('ID of the product to edit: ');
        const updatedProductData = await getProductInput();
        const updatedProduct = await productsModule.update(parseInt(productIdToUpdate), updatedProductData);
        console.log(updatedProduct > 0 ? 'Product successfully updated.' : 'No product found.');
        break;
      case '5':
        const productIdDelete = await question('ID of the product to delete: ');
        const deletedProduct = await productsModule.delete(parseInt(productIdDelete));
        console.log(deletedProduct > 0 ? 'Product successfully deleted.' : 'No product found.');
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
  while (orderManaging) {
    const choice = await showOrderMenu();
    switch (choice) {
      case '1':
        // Create a new order
        const orderData = await getPurchaseOrderInput();
        const customerExists = await customersModule.getById(orderData.customer_id);

        const orderId = await purchaseOrdersModule.create(orderData);
        console.log('Order successfully created. ID:', orderId);

        // Add details to the order
        let addingDetails = true;
        while (addingDetails) {
          console.log('\n--- Order Details Menu ---');
          console.log('1. Add order detail');
          console.log('2. Save and exit');
          console.log('3. Exit without saving');

          const detailChoice = await question('Choose an option: ');

          switch (detailChoice) {
            case '1':
              const orderDetail = await getOrderDetailInput(orderId);
              if (orderDetail) {
                await purchaseOrdersModule.addOrderDetail(orderDetail);
                console.log('Order detail successfully added.');
              }
              break;
            case '2':
              addingDetails = false;
              break;
            case '3':
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
        const orderIdGet = await question('ID of the order to view: ');
        const order = await purchaseOrdersModule.getById(parseInt(orderIdGet));
        console.log(order ? 'Order:' : 'No order found.', order);
        break;
      case '4':
        const orderIdUpdate = await question('ID of the order to edit: ');
        const updatedOrderData = await getPurchaseOrderInput();
        const updatedOrder = await purchaseOrdersModule.update(parseInt(orderIdUpdate), updatedOrderData);
        console.log(updatedOrder > 0 ? 'Order successfully updated.' : 'No order found.');
        break;
      case '5':
        const orderIdDelete = await question('ID of the order to delete: ');
        const deletedOrder = await purchaseOrdersModule.delete(parseInt(orderIdDelete));
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
        const payment = await paymentsModule.getById(parseInt(paymentIdGet));
        console.log(payment ? 'Payment:' : 'No payment found.', payment);
        break;
      case '4':
        const paymentIdUpdate = await question('ID of the payment to edit: ');
        const updatedPaymentData = await getPaymentInput();
        const updatedPayment = await paymentsModule.update(parseInt(paymentIdUpdate), updatedPaymentData);
        console.log(updatedPayment > 0 ? 'Payment successfully updated.' : 'No payment found.');
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
  }
}

// Main function to control the menu navigation
async function main() {
  let running = true;
  while (running) {
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
        running = false;
        break;
      default:
        console.log('Invalid option. Please try again.');
    }
  }

  rl.close();
}
// Start the application
main();
