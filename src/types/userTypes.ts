import { Request } from "express";

export interface JWTPayload {
  id: string,
  firstname: string
  lastname: string
  email: string 
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload | undefined
}

export interface UserBody {
  id?: string,
  firstname: string,
  lastname: string,
  phonenumber: string,
  gender: string, // ['male', 'female']
  email: string,
  password: string,
  dateofbirth?: string,
  bio?: string,
  google_id?: string,
  facebook_id?: string,
}

export interface Users extends UserBody {
    id: string
}

export interface UpdateUser extends Omit<UserBody, 'password'> {
  password?: string
}

export type ResponseUser = {
  id: string,
  firstname: string,
  lastname: string,
  phonenumber: string,
  gender: string, // ['male', 'female']
  email: string,
  password?: string,
  dateofbirth: string,
  bio: string,
  google_id?: string,
  facebook_id?: string,
}

export type Token = {
    token: string
}

export type Login = {
    email: string,
    password: string,
    trust?: boolean,
}