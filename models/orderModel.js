import prisma from '../config/db.js';

// GET /api/orders
export const fetchAllOrders = async (page = 1, limit = 20, status = '') => {
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.orders.findMany({
      where,
      skip,
      take: limit,
      include: {
        customers: {
          select: {
            customername: true,
            country: true,
          },
        },
        orderdetails: {
          select: {
            quantityordered: true,
            priceeach: true,
          },
        },
      },
      orderBy: {
        orderdate: 'desc',
      },
    }),
    prisma.orders.count({ where }),
  ]);

  return {
    orders: orders.map((order) => {
      const totalAmount = order.orderdetails.reduce(
        (sum, detail) => sum + detail.quantityordered * Number(detail.priceeach),
        0
      );

      return {
        ordernumber: order.ordernumber,
        orderdate: order.orderdate,
        requireddate: order.requireddate,
        shippeddate: order.shippeddate,
        status: order.status,
        comments: order.comments,
        customername: order.customers?.customername || 'N/A',
        country: order.customers?.country || 'N/A',
        totalItems: order.orderdetails.length,
        totalAmount,
      };
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// GET /api/orders/on-hold
export const fetchOnHoldOrders = async () => {
  const onHoldOrders = await prisma.orders.findMany({
    where: {
      status: 'On Hold',
    },
    include: {
      customers: {
        select: {
          customername: true,
          contactfirstname: true,
          contactlastname: true,
          phone: true,
        },
      },
      orderdetails: {
        select: {
          quantityordered: true,
          priceeach: true,
        },
      },
    },
    orderBy: {
      orderdate: 'desc',
    },
  });

  return onHoldOrders.map((order) => {
    const totalAmount = order.orderdetails.reduce(
      (sum, detail) => sum + detail.quantityordered * Number(detail.priceeach),
      0
    );

    return {
      ordernumber: order.ordernumber,
      orderdate: order.orderdate,
      customername: order.customers?.customername || 'N/A',
      contactPerson: order.customers
        ? `${order.customers.contactfirstname} ${order.customers.contactlastname}`
        : 'N/A',
      phone: order.customers?.phone || 'N/A',
      totalItems: order.orderdetails.length,
      totalAmount,
      comments: order.comments,
    };
  });
};

// GET /api/orders/shipping-delays
export const fetchShippingDelays = async (limit = 20) => {
  const ordersWithShipping = await prisma.orders.findMany({
    where: {
      shippeddate: {
        not: null,
      },
    },
    include: {
      customers: {
        select: {
          customername: true,
          country: true,
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

  const ordersWithDelay = ordersWithShipping.map((order) => {
    const orderDate = new Date(order.orderdate);
    const shippedDate = new Date(order.shippeddate);
    const delayDays = Math.floor((shippedDate - orderDate) / (1000 * 60 * 60 * 24));

    const totalAmount = order.orderdetails.reduce(
      (sum, detail) => sum + detail.quantityordered * Number(detail.priceeach),
      0
    );

    return {
      ordernumber: order.ordernumber,
      orderdate: order.orderdate,
      shippeddate: order.shippeddate,
      delayDays,
      status: order.status,
      customername: order.customers?.customername || 'N/A',
      country: order.customers?.country || 'N/A',
      totalAmount,
    };
  });

  // Sort by delay desc
  ordersWithDelay.sort((a, b) => b.delayDays - a.delayDays);

  return ordersWithDelay.slice(0, limit);
};
