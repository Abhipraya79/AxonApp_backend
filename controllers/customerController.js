import {
  fetchAllCustomers,
  fetchTopCustomers,
} from '../models/customerModel.js';

export const getAllCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const data = await fetchAllCustomers(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await fetchTopCustomers(limit);
    res.status(200).json({
      success: true,
      message: 'Top VIP customers retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
