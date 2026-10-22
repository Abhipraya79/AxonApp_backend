import prisma from '../config/db.js';

// GET /api/finances/payments
export const fetchPayments = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    prisma.payments.findMany({
      skip,
      take: limit,
      include: {
        customers: {
          select: {
            customernumber: true,
            customername: true,
            country: true,
          },
        },
      },
      orderBy: {
        paymentdate: 'desc',
      },
    }),
    prisma.payments.count(),
  ]);

  return {
    payments: payments.map((payment) => ({
      checknumber: payment.checknumber,
      paymentdate: payment.paymentdate,
      amount: Number(payment.amount),
      customernumber: payment.customernumber,
      customername: payment.customers?.customername || 'N/A',
      country: payment.customers?.country || 'N/A',
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// GET /api/finances/revenue-vs-cash
export const fetchRevenueVsCash = async () => {
  // Expected Revenue dari orderdetails
  const orderDetailsData = await prisma.orderdetails.findMany({
    select: {
      quantityordered: true,
      priceeach: true,
    },
  });

  const expectedRevenue = orderDetailsData.reduce(
    (sum, item) => sum + item.quantityordered * Number(item.priceeach),
    0
  );

  // Actual Cash dari payments
  const paymentsData = await prisma.payments.aggregate({
    _sum: {
      amount: true,
    },
  });

  const actualCash = Number(paymentsData._sum.amount || 0);

  const difference = expectedRevenue - actualCash;
  const collectionRate = expectedRevenue > 0 ? (actualCash / expectedRevenue) * 100 : 0;

  return {
    expectedRevenue,
    actualCash,
    difference,
    collectionRate: parseFloat(collectionRate.toFixed(2)),
    status: difference > 0 ? 'Outstanding' : 'Balanced',
  };
};
