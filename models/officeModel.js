import prisma from '../config/db.js';

// GET /api/offices/performance
// Relasi: offices -> employees -> customers -> orders -> orderdetails
export const fetchOfficePerformance = async () => {
  const offices = await prisma.offices.findMany({
    include: {
      employees: {
        include: {
          customers: {
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
          },
        },
      },
    },
  });

  const officeStats = offices.map((office) => {
    let totalRevenue = 0;
    let totalOrders = 0;
    const customerSet = new Set();

    office.employees.forEach((employee) => {
      employee.customers.forEach((customer) => {
        customerSet.add(customer.customernumber);

        customer.orders.forEach((order) => {
          totalOrders += 1;
          const orderRevenue = order.orderdetails.reduce(
            (sum, detail) =>
              sum + detail.quantityordered * Number(detail.priceeach),
            0
          );
          totalRevenue += orderRevenue;
        });
      });
    });

    return {
      officecode: office.officecode,
      city: office.city,
      country: office.country,
      territory: office.territory,
      totalEmployees: office.employees.length,
      totalCustomers: customerSet.size,
      totalOrders,
      totalRevenue,
    };
  });

  // Sort by revenue desc
  officeStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return officeStats;
};
