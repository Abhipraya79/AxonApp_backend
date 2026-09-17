import pool from '../config/db.js';

export const fetchKpiStats = async () => {
  // Di pg, data kembalian ada di dalam properti 'rows'
  const { rows: revenueRows } = await pool.query(
    'SELECT COALESCE(SUM(quantityordered * priceeach), 0) AS totalrevenue FROM orderdetails'
  );
  const { rows: ordersRows } = await pool.query(
    'SELECT COUNT(*) AS totalorders FROM orders'
  );
  const { rows: customersRows } = await pool.query(
    'SELECT COUNT(*) AS totalcustomers FROM customers'
  );
  const { rows: productsRows } = await pool.query(
    'SELECT COUNT(*) AS totalproducts FROM products'
  );

  return {
    totalRevenue: parseFloat(revenueRows[0].totalrevenue || 0),
    // PostgreSQL me-return COUNT sebagai string (bigint), jadi harus di-parse ke integer
    totalOrders: parseInt(ordersRows[0].totalorders, 10),
    totalCustomers: parseInt(customersRows[0].totalcustomers, 10),
    totalProducts: parseInt(productsRows[0].totalproducts, 10),
  };
};

export const fetchTopProducts = async (limit = 5) => {
  const { rows } = await pool.query(
    `SELECT 
      p.productcode, 
      p.productname, 
      p.productline, 
      SUM(od.quantityordered) AS totalquantitysold, 
      SUM(od.quantityordered * od.priceeach) AS totalsales 
     FROM orderdetails od 
     JOIN products p ON od.productcode = p.productcode 
     GROUP BY p.productcode, p.productname, p.productline 
     ORDER BY totalsales DESC 
     LIMIT $1`, // Menggunakan $1 untuk PostgreSQL
    [Number(limit)]
  );
  return rows;
};

export const fetchRecentOrders = async (limit = 5) => {
  const { rows } = await pool.query(
    `SELECT 
      o.ordernumber, 
      o.orderdate, 
      o.status, 
      c.customername, 
      SUM(od.quantityordered * od.priceeach) AS totalamount 
     FROM orders o 
     JOIN customers c ON o.customernumber = c.customernumber 
     JOIN orderdetails od ON o.ordernumber = od.ordernumber 
     GROUP BY o.ordernumber, o.orderdate, o.status, c.customername 
     ORDER BY o.orderdate DESC 
     LIMIT $1`, // Menggunakan $1 untuk PostgreSQL
    [Number(limit)]
  );
  return rows;
};

export const fetchMonthlySales = async () => {
  const { rows } = await pool.query(
    `SELECT 
      TO_CHAR(o.orderdate, 'YYYY-MM') AS month,
      SUM(od.quantityordered * od.priceeach) AS monthlyrevenue,
      COUNT(DISTINCT o.ordernumber) AS ordercount
     FROM orders o
     JOIN orderdetails od ON o.ordernumber = od.ordernumber
     GROUP BY TO_CHAR(o.orderdate, 'YYYY-MM')
     ORDER BY month ASC`
  );
  return rows;
};