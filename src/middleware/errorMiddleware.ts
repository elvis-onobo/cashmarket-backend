import { ErrorRequestHandler } from 'express'
import logger from '../helpers/logger'

export const errorMiddleware:ErrorRequestHandler  = (err, req, res, next) => {    
    const status = err.status || 500
    console.log('errror >>>> ', err);
    
    logger.error(err)
    
    const message = err.message || 'There\'s a problem from our end. We are working to fix this.'

    res.header("Content-Type", 'application/json')
    res.status(status).json({
        success: false,
        status,
        message
    })
}