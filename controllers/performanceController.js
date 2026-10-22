import {
  fetchEmployeePerformance,
  fetchTeamPerformance,
  fetchVendorPerformance,
} from '../models/performanceModel.js';

export const getEmployeePerformance = async (req, res, next) => {
  try {
    const data = await fetchEmployeePerformance();
    res.status(200).json({
      success: true,
      message: 'Employee performance metrics retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamPerformance = async (req, res, next) => {
  try {
    const data = await fetchTeamPerformance();
    res.status(200).json({
      success: true,
      message: 'Team performance metrics retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getVendorPerformance = async (req, res, next) => {
  try {
    const data = await fetchVendorPerformance();
    res.status(200).json({
      success: true,
      message: 'Vendor performance metrics retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
