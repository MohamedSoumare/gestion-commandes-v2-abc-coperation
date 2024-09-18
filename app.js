const readline = require('readline');
const customerModule = require('./src/customerModule');
const productModule = require('./src/productModule');
const purchaseOrderModule = require('./src/purchaseOrderModule');
const paymentModule = require('./src/paymentModule');

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
async function getOrderDetailInput(order_id) {
  const product_id = await question('Product ID: ');
  const product = await productModule.getById(parseInt(product_id));

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
    order_id: order_id 
  };
}

// Function to collect payment data
async function getPaymentInput() {
  const date = await question('Date of payment (YYYY-MM-DD): ');
  const amount = await question('Amount: ');
  const payment_method = await question('Payment method: ');
  const order_id = await question('Order ID: ');

  // Validate inputs
  if (!date || !amount || !payment_method || !order_id) {
    throw new Error('All fields (date, amount, payment_method, order_id) are required.');
  }

  if (isNaN(amount) || parseFloat(amount) <= 0) {
    throw new Error('Amount must be a positive number.');
  }

  if (isNaN(order_id) || parseInt(order_id) <= 0) {
    throw new Error('Order ID must be a valid positive integer.');
  }

  return {
    date,
    amount: parseFloat(amount),
    payment_method,
    order_id: parseInt(order_id)
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
    try {
      const choice = await showCustomerMenu();
      switch (choice) {
        case '1':
          const customerData = await getCustomerInput();
          await customerModule.create(customerData);
          console.log('Customer successfully added.');
          break;
        case '2':
          const customers = await customerModule.getAll();
          console.log('Customers:', customers);
          break;
        case '3':
          const customerId = await question('ID of the customer to view: ');
          const customer = await customerModule.getById(parseInt(customerId));
          customer ? console.log('Customer:', customer) : console.log('No customer found.');
          break;
        case '4':
          const customerIdUpdate = await question('ID of the customer to edit: ');
          const updatedCustomerData = await getCustomerInput();
          const updatedCustomer = await customerModule.update(parseInt(customerIdUpdate), updatedCustomerData);
          console.log(updatedCustomer > 0 ? 'Customer successfully updated.' : 'No customer found.');
          break;
        case '5':
          const customerIdDelete = await question('ID of the customer to delete: ');
          const deletedCustomer = await customerModule.delete(parseInt(customerIdDelete));
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
          case '1': // Add a product
              const productData = await getProductInput();

              try {
                  // Use 'productData' instead of 'product' to create a product
                  const productId = await productModule.create(productData);
                  console.log(`Product added successfully with ID: ${productId}`);
              } catch (error) {
                  // Display only the error message without the stack trace
                  console.error('Error creating product:', error.message);
              }
              break;

          case '2': // View all products
              try {
                  const products = await productModule.getAll();
                  console.log('Products:', products);
              } catch (error) {
                  console.error('Error fetching products:', error.message);
              }
              break;

          case '3': // View a product by ID
              const productIdGet = await question('ID of the product to view: ');
              try {
                  const product = await productModule.getById(parseInt(productIdGet));
                  if (product) {
                      console.log('Product:', product);
                  } else {
                      console.log(`No product found with ID ${productIdGet}.`);
                  }
              } catch (error) {
                  console.error('Error fetching product:', error.message);
              }
              break;

          case '4': // Edit a product
              const productIdToUpdate = await question('ID of the product to edit: ');
              const updatedProductData = await getProductInput();

              // Validate input fields
              if (!updatedProductData.name || !updatedProductData.description || !updatedProductData.stock ||
                  !updatedProductData.price || !updatedProductData.category ||
                  !updatedProductData.barcode || !updatedProductData.status) {
                  console.log('Error: All fields (name, description, stock, price, category, barcode, status) are required.');
              } else {
                  try {
                      const updatedProduct = await productModule.update(parseInt(productIdToUpdate), updatedProductData);
                      console.log(updatedProduct > 0 ? 'Product successfully updated.' : 'No product found.');
                  } catch (error) {
                      console.error('Error updating product:', error.message);
                  }
              }
              break;

          case '5': // Delete a product
              const productIdDelete = await question('ID of the product to delete: ');
              try {
                  const deletedProduct = await productModule.delete(parseInt(productIdDelete));
                  console.log(deletedProduct > 0 ? 'Product successfully deleted.' : 'No product found.');
              } catch (error) {
                  console.log(`An error occurred: ${error.message}`);
              }
              break;

          case '6': // Return to main menu
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

        // Validation of the customer ID before proceeding
        if (isNaN(orderData.customer_id) || !orderData.customer_id) {
          console.log('Invalid customer ID. Please provide a valid customer ID.');
          break;
        }

        try {
          const customerExists = await customerModule.getById(orderData.customer_id);
          currentOrder = orderData; // Store the order data temporarily
          orderDetails = []; // Reset the order details

          console.log('Order data saved. You can now add details.');

          let addingDetails = true;
          while (addingDetails) {
            console.log('\n--- Order Details Menu ---');
            console.log('1. Add an order detail');
            console.log('2. Save and exit');
            console.log('3. Exit without saving');
            const detailChoice = await question('Choose an option: ');

            switch (detailChoice) {
              case '1': // Add order detail
                const orderDetail = await getOrderDetailInput();
                if (orderDetail) {
                  orderDetails.push(orderDetail); // Add detail to temporary storage
                  console.log('Order detail added.');
                }
                break;

              case '2': // Save to database
                if (currentOrder) {
                  try {
                    // Save the order first
                    const order_id = await purchaseOrderModule.create(currentOrder);
                    console.log('Order successfully saved. ID:', order_id);

                    // Save order details in the database
                    for (const detail of orderDetails) {
                      detail.order_id = order_id; // Assign order ID to each detail
                      await purchaseOrderModule.addOrderDetail(detail);
                    }
                    console.log('Order details saved successfully.');
                  } catch (error) {
                    console.log('Error saving order or details: ' + error.message);
                  }
                } else {
                  console.log('No orders to save.');
                }
                addingDetails = false;
                break;

              case '3': // Exit without saving
                currentOrder = null; // Reset temporary order data
                orderDetails = [];   // Reset temporary order details
                console.log('Order creation cancelled.');
                addingDetails = false;
                break;

              default:
                console.log('Invalid option. Please try again.');
            }
          }
        } catch (error) {
          console.log('Error validating customer or processing order: ' + error.message);
        }
        break;

      case '2': 
        try {
          const orders = await purchaseOrderModule.getAll(); 
          console.log('Orders:', orders);
        } catch (error) {
          console.log('Error retrieving orders: ' + error.message);
        }
        break;

      case '3': 
          try {
            const order_id = parseInt(await question('Order ID to be viewed:'));

            // Ensure the ID is valid before attempting to retrieve the order
            if (isNaN(order_id) || order_id <= 0) {
              console.log('Invalid order ID. Please provide a valid order ID.');
              break;
            }

            const order = await purchaseOrderModule.getById(order_id);
            console.log(order ? 'Order:' : 'No orders found.', order);
          } catch (error) {
            // Display user-friendly message only
            console.log('Error retrieving the order: ' + error.message);
          }
          break;
      case '4': // Edit an order
      try {
        const order_idUpdate = parseInt(await question('The ID of the order to be modified: '));

        // Ensure the ID is valid before attempting to retrieve the order
        if (isNaN(order_idUpdate) || order_idUpdate <= 0) {
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
              const currentDetails = await purchaseOrderModule.getOrderDetails(order_idUpdate);
              console.log('Current order details:', currentDetails);
              break;

            case '2': // Add new order detail
              const newDetail = await getOrderDetailInput(order_idUpdate);
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
              const updatedDetail = await getOrderDetailInput(order_idUpdate);
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
          await purchaseOrderModule.update(parseInt(order_idUpdate), updatedOrderData);
          console.log('Order updated successfully.');
        } else {
          console.log('Changes cancelled.');
        }
      } catch (error) {
        console.log('Error while updating the order: ' + error.message);
      }
      break;

    case '5': // Delete an order
      try {
        const order_idDelete = parseInt(await question('ID of the order to delete:'));
        if (isNaN(order_idDelete) || order_idDelete <= 0) {
          console.log('Invalid order ID. Please provide a valid order ID.');
          break;
        }
        const deletedOrder = await purchaseOrderModule.delete(order_idDelete);
        console.log(deletedOrder > 0 ? 'Order successfully deleted.' : 'No order found.');
      } catch (error) {
        console.log('Error deleting order: ' + error.message);
      }
      break;

    case '6': // Exit
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
          try {
            const paymentData = await getPaymentInput();
            await paymentModule.create(paymentData);
            console.log('Payment successfully added.');
          } catch (error) {
            console.log('An error occurred while adding payment:', error.message);
          }
          break;
        case '2':
          const payments = await paymentModule.getAll();
          console.log('Payments:', payments);
          break;
        case '3':
          const paymentIdGet = await question('ID of the payment to view: ');
          try {
            const payment = await paymentModule.getById(parseInt(paymentIdGet));
            console.log('Payment:', payment);
          } catch (error) {
            console.log('An error occurred while retrieving payment:', error.message);
          }
          break;
        case '4':
          const paymentIdUpdate = await question('ID of the payment to edit: ');
          try {
            const updatedPaymentData = await getPaymentInput();
            const updatedPayment = await paymentModule.update(parseInt(paymentIdUpdate), updatedPaymentData);
            console.log(updatedPayment > 0 ? 'Payment successfully updated.' : 'No payment found.');
          } catch (error) {
            console.log('An error occurred while updating payment:', error.message);
          }
          break;
        case '5':
          const paymentIdDelete = await question('ID of the payment to delete: ');
          try {
            const deletedPayment = await paymentModule.delete(parseInt(paymentIdDelete));
            console.log(deletedPayment > 0 ? 'Payment successfully deleted.' : 'No payment found.');
          } catch (error) {
            console.log('An error occurred while deleting payment:', error.message);
          }
          break;
        case '6':
          paymentManaging = false;
          break;
        default:
          console.log('Invalid option. Please try again.');
      }
    } catch (error) {
      console.log('An unexpected error occurred:', error.message);
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
