import pool from '../config/db.js';

export const fetchKpiStats = async () => {
  const [revenueRows] = await pool.query(
    'SELECT COALESCE(SUM(quantityOrdered * priceEach), 0) AS totalRevenue FROM orderdetails'
  );
  const [ordersRows] = await pool.query(
    'SELECT COUNT(*) AS totalOrders FROM orders'
  );
  const [customersRows] = await pool.query(
    'SELECT COUNT(*) AS totalCustomers FROM customers'
  );
  const [productsRows] = await pool.query(
    'SELECT COUNT(*) AS totalProducts FROM products'
  );

  return {
    totalRevenue: parseFloat(revenueRows[0].totalRevenue || 0),
    totalOrders: ordersRows[0].totalOrders,
    totalCustomers: customersRows[0].totalCustomers,
    totalProducts: productsRows[0].totalProducts,
  };
};

export const fetchTopProducts = async (limit = 5) => {
  const [rows] = await pool.query(
    `SELECT 
      p.productCode, 
      p.productName, 
      p.productLine, 
      SUM(od.quantityOrdered) AS totalQuantitySold, 
      SUM(od.quantityOrdered * od.priceEach) AS totalSales 
     FROM orderdetails od 
     JOIN products p ON od.productCode = p.productCode 
     GROUP BY p.productCode, p.productName, p.productLine 
     ORDER BY totalSales DESC 
     LIMIT ?`,
    [Number(limit)]
  );
  return rows;
};

export const fetchRecentOrders = async (limit = 5) => {
  const [rows] = await pool.query(
    `SELECT 
      o.orderNumber, 
      o.orderDate, 
      o.status, 
      c.customerName, 
      SUM(od.quantityOrdered * od.priceEach) AS totalAmount 
     FROM orders o 
     JOIN customers c ON o.customerNumber = c.customerNumber 
     JOIN orderdetails od ON o.orderNumber = od.orderNumber 
     GROUP BY o.orderNumber, o.orderDate, o.status, c.customerName 
     ORDER BY o.orderDate DESC 
     LIMIT ?`,
    [Number(limit)]
  );
  return rows;
};

export const fetchMonthlySales = async () => {
  const [rows] = await pool.query(
    `SELECT 
      DATE_FORMAT(o.orderDate, '%Y-%m') AS month,
      SUM(od.quantityOrdered * od.priceEach) AS monthlyRevenue,
      COUNT(DISTINCT o.orderNumber) AS orderCount
     FROM orders o
     JOIN orderdetails od ON o.orderNumber = od.orderNumber
     GROUP BY DATE_FORMAT(o.orderDate, '%Y-%m')
     ORDER BY month ASC`
  );
  return rows;
};
