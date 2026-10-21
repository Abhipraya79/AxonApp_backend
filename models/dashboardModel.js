import prisma from '../config/db.js';

export const fetchKpiStats = async () => {
  const totalRevenue = await prisma.orderdetails.aggregate({
    _sum: {
      priceeach: true,
    },
  });

  const totalOrders = await prisma.orders.count();
  const totalCustomers = await prisma.customers.count();
  const totalProducts = await prisma.products.count();

  // Hitung total revenue manual karena perlu quantityordered * priceeach
  const revenueData = await prisma.orderdetails.findMany({
    select: {
      quantityordered: true,
      priceeach: true,
    },
  });

  const calculatedRevenue = revenueData.reduce(
    (sum, item) => sum + item.quantityordered * Number(item.priceeach),
    0
  );

  return {
    totalRevenue: calculatedRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
  };
};

export const fetchTopProducts = async (limit = 5) => {
  const topProducts = await prisma.orderdetails.groupBy({
    by: ['productcode'],
    _sum: {
      quantityordered: true,
    },
    orderBy: {
      _sum: {
        quantityordered: 'desc',
      },
    },
    take: limit,
  });

  // Ambil detail produk dan hitung total sales
  const enrichedProducts = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.products.findUnique({
        where: { productcode: item.productcode },
        select: {
          productcode: true,
          productname: true,
          productline_id: true,
        },
      });

      const salesData = await prisma.orderdetails.findMany({
        where: { productcode: item.productcode },
        select: {
          quantityordered: true,
          priceeach: true,
        },
      });

      const totalSales = salesData.reduce(
        (sum, detail) =>
          sum + detail.quantityordered * Number(detail.priceeach),
        0
      );

      return {
        productcode: product.productcode,
        productname: product.productname,
        productline: product.productline_id,
        totalquantitysold: item._sum.quantityordered,
        totalsales: totalSales,
      };
    })
  );

  // Sort ulang berdasarkan totalsales
  return enrichedProducts.sort((a, b) => b.totalsales - a.totalsales);
};

export const fetchRecentOrders = async (limit = 5) => {
  const orders = await prisma.orders.findMany({
    take: limit,
    orderBy: {
      orderdate: 'desc',
    },
    include: {
      customers: {
        select: {
          customername: true,
        },
      },
      orderdetails: {
        select: {
          quantityordered: true,
          priceeach: true,
        },
      },
    },
  });

  return orders.map((order) => {
    const totalAmount = order.orderdetails.reduce(
      (sum, detail) =>
        sum + detail.quantityordered * Number(detail.priceeach),
      0
    );

    return {
      ordernumber: order.ordernumber,
      orderdate: order.orderdate,
      status: order.status,
      customername: order.customers?.customername || 'N/A',
      totalamount: totalAmount,
    };
  });
};

export const fetchMonthlySales = async () => {
  const ordersWithDetails = await prisma.orders.findMany({
    select: {
      orderdate: true,
      ordernumber: true,
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

  // Group by month
  const monthlyMap = {};

  ordersWithDetails.forEach((order) => {
    const month = order.orderdate.toISOString().slice(0, 7); // YYYY-MM
    const revenue = order.orderdetails.reduce(
      (sum, detail) =>
        sum + detail.quantityordered * Number(detail.priceeach),
      0
    );

    if (!monthlyMap[month]) {
      monthlyMap[month] = {
        month,
        monthlyrevenue: 0,
        ordercount: 0,
      };
    }

    monthlyMap[month].monthlyrevenue += revenue;
    monthlyMap[month].ordercount += 1;
  });

  return Object.values(monthlyMap).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
};
