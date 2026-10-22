import prisma from '../config/db.js';

// GET /api/performance/employees
export const fetchEmployeePerformance = async () => {
  const employees = await prisma.employees.findMany({
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
      offices: {
        select: {
          city: true,
          country: true,
        },
      },
    },
  });

  const employeeStats = employees.map((employee) => {
    const activeCustomers = employee.customers.length;
    
    let totalRevenue = 0;
    let totalOrders = 0;

    employee.customers.forEach((customer) => {
      customer.orders.forEach((order) => {
        totalOrders += 1;
        const orderRevenue = order.orderdetails.reduce(
          (sum, detail) => sum + detail.quantityordered * Number(detail.priceeach),
          0
        );
        totalRevenue += orderRevenue;
      });
    });

    return {
      employeenumber: employee.employeenumber,
      name: `${employee.firstname} ${employee.lastname}`,
      email: employee.email,
      jobtitle: employee.jobtitle,
      office: employee.offices ? `${employee.offices.city}, ${employee.offices.country}` : 'N/A',
      activeCustomers,
      totalOrders,
      totalRevenue,
    };
  });

  // Sort by revenue desc
  employeeStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return employeeStats;
};

// GET /api/performance/teams
export const fetchTeamPerformance = async () => {
  // Get all managers (employees yang punya subordinates)
  const managers = await prisma.employees.findMany({
    where: {
      subordinates: {
        some: {},
      },
    },
    include: {
      subordinates: {
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
      offices: {
        select: {
          city: true,
        },
      },
    },
  });

  const teamStats = managers.map((manager) => {
    let teamRevenue = 0;
    let teamOrders = 0;
    let teamCustomers = 0;

    manager.subordinates.forEach((employee) => {
      teamCustomers += employee.customers.length;

      employee.customers.forEach((customer) => {
        customer.orders.forEach((order) => {
          teamOrders += 1;
          const orderRevenue = order.orderdetails.reduce(
            (sum, detail) => sum + detail.quantityordered * Number(detail.priceeach),
            0
          );
          teamRevenue += orderRevenue;
        });
      });
    });

    return {
      managerId: manager.employeenumber,
      managerName: `${manager.firstname} ${manager.lastname}`,
      jobtitle: manager.jobtitle,
      office: manager.offices?.city || 'N/A',
      teamSize: manager.subordinates.length,
      teamCustomers,
      teamOrders,
      teamRevenue,
    };
  });

  // Sort by team revenue desc
  teamStats.sort((a, b) => b.teamRevenue - a.teamRevenue);

  return teamStats;
};

// GET /api/performance/vendors
export const fetchVendorPerformance = async () => {
  const products = await prisma.products.findMany({
    include: {
      orderdetails: {
        select: {
          quantityordered: true,
          priceeach: true,
        },
      },
    },
  });

  const vendorMap = {};

  products.forEach((product) => {
    const vendor = product.productvendor;

    if (!vendorMap[vendor]) {
      vendorMap[vendor] = {
        vendor,
        totalProducts: 0,
        totalQuantitySold: 0,
        totalRevenue: 0,
      };
    }

    vendorMap[vendor].totalProducts += 1;

    product.orderdetails.forEach((detail) => {
      vendorMap[vendor].totalQuantitySold += detail.quantityordered;
      vendorMap[vendor].totalRevenue += detail.quantityordered * Number(detail.priceeach);
    });
  });

  const vendorStats = Object.values(vendorMap);

  // Sort by revenue desc
  vendorStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return vendorStats;
};
