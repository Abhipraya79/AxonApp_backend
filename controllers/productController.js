import {
  fetchAllProducts,
  fetchTopSellingProducts,
  fetchProductCategories,
  fetchUnsoldProducts,
} from '../models/productModel.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const data = await fetchAllProducts(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSellingProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await fetchTopSellingProducts(limit);
    res.status(200).json({
      success: true,
      message: 'Top selling products retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductCategories = async (req, res, next) => {
  try {
    const data = await fetchProductCategories();
    res.status(200).json({
      success: true,
      message: 'Product category performance retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnsoldProducts = async (req, res, next) => {
  try {
    const data = await fetchUnsoldProducts();
    res.status(200).json({
      success: true,
      message: 'Unsold products (dead stock) retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
