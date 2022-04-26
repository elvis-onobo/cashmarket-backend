import { Request, Response } from 'express'

export function successHandler(message: string, status: number = 200, data: any = null) {
 return (req: Request, res: Response): Response => {
  return res.status(status).json({
   success: true,
   status,
   message,
   data,
  })
 }
}
