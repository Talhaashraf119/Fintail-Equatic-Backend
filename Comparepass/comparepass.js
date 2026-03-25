import { hash } from "bcrypt"
import { compare } from "bcrypt"

export const hasedpass=async(password)=>{
    return await hash(password,10)
}

export const comparepass=async(password,hasedpass)=>{// plain password and hased password
    return await compare(password,hasedpass)
}