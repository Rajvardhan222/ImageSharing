import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export const signUpSchema = z.object({
    name : z.string().min(2,{message: "Name must be at least 2 characters"}),

    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8,{message: "Password Should be atlease of 8 characters"}).max(50)
   
  })

  export const signinSchema = z.object({
   
    email: z.string().email(),
    password: z.string().min(8,{message: "Password Should be atlease of 8 characters"}).max(50)
   
  })

  export const postValidation = z.object({
   
    caption : z.string().min(5).max(2200),
    file:z.custom<File[]>(),
    location : z.string().min(2).max(100),
    tags:z.string()
   
  })