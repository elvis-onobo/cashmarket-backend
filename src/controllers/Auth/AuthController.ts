import { Request, Response } from 'express'
import AuthService from "../../services/Auth/AuthService";
import successHandler from '../../helpers/successHandler';
import { Unauthorized, InternalServerError, NotFound } from 'http-errors'

export default class AuthController{
    /**
     * Login a user
     * @param req 
     * @param res 
     * @returns 
     */
    public static async login(req: Request, res: Response): Promise<Response>{
        // TODO: Add validation
        console.log('Got here 1 >>>>>>> ');
        const data = await AuthService.loginUser(req.body)
        return successHandler(200, 'Login successful', data, res)
    }

    /**
     * Sign up a user
     * @param req 
     * @param res 
     * @returns 
     */
    public static async signup(req: Request, res: Response): Promise<Response>{
        const data = await AuthService.signup(req.body)
        return successHandler(200, 'Registration successful', data, res)
    }

    public static async verifyEmail(){}
    public static async forgotPassword(){}
    public static async updateProfile(){}
}