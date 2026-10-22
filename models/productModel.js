import prisma from '../config/db.js';

// GET /api/products
export const fetchAllProducts = async (page = 1, limit = 20, search = '') => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { productname: { contains: search, mode: 'insensitive' } },
          { productcode: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where,
      skip,
      take: limit,
      include: {
        productlines: {
          select: {
            productline: true,
            textdescription: true,
          },
        },
      },
      orderBy: {
        productname: 'asc',
      },
    }),
    prisma.products.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// GET /api/products/top-selling
export const fetchTopSellingProducts = async (limit = 10) => {
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

  const enrichedProducts = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.products.findUnique({
        where: { productcode: item.productcode },
        select: {
          productcode: true,
          productname: true,
          productline_id: true,
          quantityinstock: true,
        },
      });

      // Skip jika product sudah tidak ada
      if (!product) return null;

      const salesData = await prisma.orderdetails.findMany({
        where: { productcode: item.productcode },
        select: {
          quantityordered: true,
          priceeach: true,
        },
      });

      const totalRevenue = salesData.reduce(
        (sum, detail) => sum + detail.quantityordered * Number(detail.priceeach),
        0
      );

      return {
        productcode: product.productcode,
        productname: product.productname,
        productline: product.productline_id,
        quantityinstock: product.quantityinstock,
        totalQuantitySold: item._sum.quantityordered,
        totalRevenue,
      };
    })
  );

  // Filter null values
  return enrichedProducts.filter(p => p !== null);
};

// GET /api/products/categories
export const fetchProductCategories = async () => {
  const categories = await prisma.orderdetails.findMany({
    select: {
      quantityordered: true,
      priceeach: true,
      products: {
        select: {
          productline_id: true,
        },
      },
    },
  });

  const categoryMap = {};

  categories.forEach((item) => {
    if (!item.products) return;
    
    const line = item.products.productline_id || 'Unknown';
    const revenue = item.quantityordered * Number(item.priceeach);

    if (!categoryMap[line]) {
      categoryMap[line] = {
        productline: line,
        totalRevenue: 0,
        totalQuantitySold: 0,
      };
    }

    categoryMap[line].totalRevenue += revenue;
    categoryMap[line].totalQuantitySold += item.quantityordered;
  });

  return Object.values(categoryMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
};

// GET /api/products/unsold
export const fetchUnsoldProducts = async () => {
  const allProducts = await prisma.products.findMany({
    select: {
      productcode: true,
      productname: true,
      productline_id: true,
      quantityinstock: true,
      buyprice: true,
    },
  });

  const soldProductCodes = await prisma.orderdetails.findMany({
    select: {
      productcode: true,
    },
    distinct: ['productcode'],
  });

  const soldSet = new Set(soldProductCodes.map((p) => p.productcode));

  const unsoldProducts = allProducts.filter((p) => !soldSet.has(p.productcode));

  return unsoldProducts.map((p) => ({
    productcode: p.productcode,
    productname: p.productname,
    productline: p.productline_id,
    quantityinstock: p.quantityinstock,
    buyprice: Number(p.buyprice),
  }));
};
