import {z} from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(5, { message: "Content must be of atleast 5 characters" })
    .max(300,{message:"Content must be of atmost 300 characters"}),

})