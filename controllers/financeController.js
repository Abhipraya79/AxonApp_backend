import {
  fetchPayments,
  fetchRevenueVsCash,
} from '../models/financeModel.js';

export const getPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const data = await fetchPayments(page, limit);
    res.status(200).json({
      success: true,
      message: 'Payment history retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueVsCash = async (req, res, next) => {
  try {
    const data = await fetchRevenueVsCash();
    res.status(200).json({
      success: true,
      message: 'Revenue vs cash flow comparison retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
