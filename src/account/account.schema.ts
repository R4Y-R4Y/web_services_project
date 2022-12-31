import { z } from "zod";

const getAccountSingleSchema = z.object({
    id: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
})

export type GetAccountSingleInput = z.infer<typeof getAccountSingleSchema>

const createAccountSchema = z.object({
    id: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
    balance: z.number({
        required_error: "Balance is required",
        invalid_type_error: "Balance must be a number"
    }),
    
})

export type CreateAccountInput = z.infer<typeof createAccountSchema>