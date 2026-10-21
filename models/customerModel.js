import prisma from '../config/db.js';

// GET /api/customers
export const fetchAllCustomers = async (page = 1, limit = 20, search = '') => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { customername: { contains: search, mode: 'insensitive' } },
          { contactfirstname: { contains: search, mode: 'insensitive' } },
          { contactlastname: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customers.findMany({
      where,
      skip,
      take: limit,
      include: {
        employees: {
          select: {
            employeenumber: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
      orderBy: {
        customername: 'asc',
      },
    }),
    prisma.customers.count({ where }),
  ]);

  return {
    customers: customers.map((c) => ({
      customernumber: c.customernumber,
      customername: c.customername,
      contactfirstname: c.contactfirstname,
      contactlastname: c.contactlastname,
      phone: c.phone,
      city: c.city,
      country: c.country,
      creditlimit: Number(c.creditlimit),
      salesRep: c.employees
        ? {
            employeenumber: c.employees.employeenumber,
            name: `${c.employees.firstname} ${c.employees.lastname}`,
            email: c.employees.email,
          }
        : null,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// GET /api/customers/top
export const fetchTopCustomers = async (limit = 5) => {
  const customersWithOrders = await prisma.customers.findMany({
    include: {
      orders: {
        include: {
          orderdetails: {
            select: {
              quantityordered: true,
              priceeach: true,
            },
          },
        },
      },
    },
  });

  const customerStats = customersWithOrders.map((customer) => {
    const totalOrders = customer.orders.length;
    const totalRevenue = customer.orders.reduce((sum, order) => {
      const orderTotal = order.orderdetails.reduce(
        (orderSum, detail) =>
          orderSum + detail.quantityordered * Number(detail.priceeach),
        0
      );
      return sum + orderTotal;
    }, 0);

    return {
      customernumber: customer.customernumber,
      customername: customer.customername,
      contactfirstname: customer.contactfirstname,
      contactlastname: customer.contactlastname,
      country: customer.country,
      totalOrders,
      totalRevenue,
    };
  });

  // Sort by revenue desc
  customerStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return customerStats.slice(0, limit);
};
