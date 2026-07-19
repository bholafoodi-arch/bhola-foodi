import { Order } from '../types';

/**
 * Utility to trigger download of a beautifully formatted invoice for an order
 */
export const downloadInvoiceFile = (order: Order) => {
  const line = '==================================================';
  const dashedLine = '--------------------------------------------------';
  
  const content = `
${line}
                 BHOLA ONLINE FOODS
            Fresh Food Delivery in Bhola
${line}
Order Reference : ${order.id}
Date Placed     : ${new Date(order.date).toLocaleString()}
Current Status  : ${order.status}
Payment Mode    : ${order.paymentMethod}
Payment Status  : ${order.paymentStatus}

CUSTOMER DETAILS:
${dashedLine}
Name            : ${order.name}
Mobile Phone    : ${order.phone}
Delivery Area   : ${order.area}
Address         : ${order.address}

ORDERED DELICACIES:
${dashedLine}
${order.items.map((item, idx) => {
  const itemTotal = item.product.price * item.quantity;
  return `${idx + 1}. ${item.product.name}
   Quantity: ${item.quantity} x ৳${item.product.price} = ৳${itemTotal}
   (Prepared by: ${item.product.restaurantName})`;
}).join('\n\n')}

${dashedLine}
Subtotal Amount : ৳${order.subtotal}
Delivery Fee    : ৳${order.deliveryCharge}
${line}
GRAND TOTAL     : ৳${order.total}
${line}

Thank you for choosing Bhola Online!
Enjoy your fresh hot dishes from our select local kitchens.
For delivery updates, contact our helpline or email mdmarufmeze@gmail.com.

Stay Safe & Happy Eating!
Developed with pride for Bhola Sadar & region.
${line}
`;

  // Create blob and trigger file download
  const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice_${order.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Utility to download a complete backup report of the user's order history
 */
export const downloadAllOrdersBackup = (orders: Order[]) => {
  const line = '==================================================';
  const dashedLine = '--------------------------------------------------';
  
  let content = `
${line}
           BHOLA ONLINE ORDER HISTORY REPORT
${line}
Backup Date   : ${new Date().toLocaleString()}
Total Orders  : ${orders.length}

SUMMARY REPORT OF ORDERS:
${dashedLine}
`;

  orders.forEach((order, index) => {
    content += `
(${index + 1}) ORDER REF: ${order.id}
Placed Date   : ${new Date(order.date).toLocaleDateString()}
Grand Total   : ৳${order.total}
Status        : ${order.status}
Payment Mode  : ${order.paymentMethod}
Items Ordered : ${order.items.reduce((sum, i) => sum + i.quantity, 0)} items
Dishes Summary:
${order.items.map(item => `  - ${item.product.name} (Qty: ${item.quantity}) [From: ${item.product.restaurantName}]`).join('\n')}
${dashedLine}
`;
  });

  content += `\nThank you for being a customer of Bhola Online!\nFor inquiries, support, or complaints, reach us at mdmarufmeze@gmail.com.\n${line}\n`;

  const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Bhola_Online_All_Orders_History.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
