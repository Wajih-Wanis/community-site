import * as z from "zod"
export const SignupValidation = z.object({
    name: z.string().min(1,{message: 'Do not leave this field empty'}),
    username: z.string().min(2,{message:'Username must be more than 2 characters'}),
    email: z.string().email(),
    password: z.string().min(8,{message:'Password should be atleast 8 characters'}),
  })
   