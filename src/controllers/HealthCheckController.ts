import { Request, Response } from "express";

export default class HealthCheck {
    public static async check(req: Request, res: Response): Promise<object>{
        return res.status(200).json({
            status: 200,
            message: 'App is live!'
        })
    }
}