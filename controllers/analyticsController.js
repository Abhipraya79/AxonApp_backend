import {
  fetchKpi,
  fetchSalesTrend,
  fetchCustomerDistribution,
} from '../models/analyticsModel.js';

export const getKpi = async (req, res, next) => {
  try {
    const data = await fetchKpi();
    res.status(200).json({
      success: true,
      message: 'KPI metrics retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesTrend = async (req, res, next) => {
  try {
    const data = await fetchSalesTrend();
    res.status(200).json({
      success: true,
      message: 'Sales trend data retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerDistribution = async (req, res, next) => {
  try {
    const data = await fetchCustomerDistribution();
    res.status(200).json({
      success: true,
      message: 'Customer distribution by country retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
