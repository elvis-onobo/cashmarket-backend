import { Request, Response } from 'express'

export const successHandler = (status = 200, message: string, data:any) => {
 return (req:Request, res: Response):Response => {
  return res.status(status).json({
    success: true,
    status,
    message,
    data,
  })
 }
}