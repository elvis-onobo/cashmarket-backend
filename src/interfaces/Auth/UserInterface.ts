export interface UserLoginInterface {
 email: string
 password: string
}

export interface UserRegistrationInterface {
 first_name: string
 last_name: string
 email: string
 phone: number
 password: string
}

export interface VerifyEmailInterface {
    code: string
}

export interface updateProfileInterface{
    first_name: string
    last_name: string
    phone: number
    oldPassword?: string
    password: string
    confirmPassword?: string
}