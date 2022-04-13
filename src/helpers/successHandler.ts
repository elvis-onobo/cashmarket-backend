import { Response } from 'express'

/**
 * Properly formats success response
 * 
 * @param status 
 * @param message 
 * @param data 
 * @param res 
 * @returns Object
 */
export default function successHandler(status: number, message: string, data: any, res: Response): Object {
 return res.status(status).json({
  success: true,
  status,
  message,
  data,
 })
}
