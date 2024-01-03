import * as z from "zod"
export const SignupValidation = z.object({
    name: z.string().min(1,{message: 'Do not leave this field empty'}),
    username: z.string().min(2,{message:'Username must be more than 2 characters'}),
    email: z.string().email(),
    password: z.string().min(8,{message:'Password should be atleast 8 characters'}),
  })

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8,{message:'Password should be atleast 8 characters'}),
  })

export const PostValidation = z.object({
    topic: z.string().min(2).max(600),
    article: z.string().min(1).max(60000),
    title: z.string().min(8).max(800),
    location: z.string().min(2).max(100),
    file: z.custom<File[]>(),
  })