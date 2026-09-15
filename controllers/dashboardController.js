import {
  fetchKpiStats,
  fetchTopProducts,
  fetchRecentOrders,
  fetchMonthlySales,
} from '../models/dashboardModel.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const kpiStats = await fetchKpiStats();
    res.status(200).json({
      success: true,
      data: kpiStats,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardSummary = async (req, res, next) => {
  try {
    const [kpi, topProducts, recentOrders, monthlySales] = await Promise.all([
      fetchKpiStats(),
      fetchTopProducts(5),
      fetchRecentOrders(5),
      fetchMonthlySales(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        kpi,
        topProducts,
        recentOrders,
        monthlySales,
      },
    });
  } catch (error) {
    next(error);
  }
};
