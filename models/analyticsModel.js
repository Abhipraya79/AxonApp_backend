import prisma from '../config/db.js';

// GET /api/analytics/kpi
export const fetchKpi = async () => {
  // Total Revenue dari orderdetails (raw aggregate)
  const revenueResult = await prisma.$queryRaw`
    SELECT COALESCE(SUM(quantityordered * priceeach), 0) AS totalrevenue
    FROM orderdetails
  `;
  const totalRevenue = Number(revenueResult[0].totalrevenue);

  // Total Profit: priceeach - buyprice (dengan JOIN)
  const profitResult = await prisma.$queryRaw`
    SELECT COALESCE(SUM(od.quantityordered * (od.priceeach - p.buyprice)), 0) AS totalprofit
    FROM orderdetails od
    INNER JOIN products p ON od.productcode = p.productcode
  `;
  const totalProfit = Number(profitResult[0].totalprofit);

  const totalCustomers = await prisma.customers.count();
  const totalEmployees = await prisma.employees.count();

  return {
    totalRevenue,
    totalProfit,
    totalCustomers,
    totalEmployees,
  };
};

// GET /api/analytics/sales-trend
export const fetchSalesTrend = async () => {
  const ordersWithDetails = await prisma.orders.findMany({
    select: {
      orderdate: true,
      orderdetails: {
        select: {
          quantityordered: true,
          priceeach: true,
        },
      },
    },
    orderBy: {
      orderdate: 'asc',
    },
  });

  // Group by year-month
  const trendMap = {};

  ordersWithDetails.forEach((order) => {
    const yearMonth = order.orderdate.toISOString().slice(0, 7); // YYYY-MM
    const revenue = order.orderdetails.reduce(
      (sum, detail) => sum + detail.quantityordered * Number(detail.priceeach),
      0
    );

    if (!trendMap[yearMonth]) {
      trendMap[yearMonth] = {
        period: yearMonth,
        totalOrders: 0,
        totalRevenue: 0,
      };
    }

    trendMap[yearMonth].totalOrders += 1;
    trendMap[yearMonth].totalRevenue += revenue;
  });

  return Object.values(trendMap).sort((a, b) => a.period.localeCompare(b.period));
};

// GET /api/analytics/customer-distribution
export const fetchCustomerDistribution = async () => {
  const distribution = await prisma.customers.groupBy({
    by: ['country'],
    _count: {
      customernumber: true,
    },
    orderBy: {
      _count: {
        customernumber: 'desc',
      },
    },
  });

  return distribution.map((item) => ({
    country: item.country,
    customerCount: item._count.customernumber,
  }));
};
