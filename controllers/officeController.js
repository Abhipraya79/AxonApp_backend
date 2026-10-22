import { fetchOfficePerformance } from '../models/officeModel.js';

export const getOfficePerformance = async (req, res, next) => {
  try {
    const data = await fetchOfficePerformance();
    res.status(200).json({
      success: true,
      message: 'Office performance metrics retrieved successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
