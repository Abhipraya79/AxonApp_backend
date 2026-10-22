import {
  fetchAllOrders,
  fetchOnHoldOrders,
  fetchShippingDelays,
} from '../models/orderModel.js';

export const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';

    const data = await fetchAllOrders(page, limit, status);
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOnHoldOrders = async (req, res, next) => {
  try {
    const data = await fetchOnHoldOrders();
    res.status(200).json({
      success: true,
      message: 'On-hold orders retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getShippingDelays = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const data = await fetchShippingDelays(limit);
    res.status(200).json({
      success: true,
      message: 'Shipping delays retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
