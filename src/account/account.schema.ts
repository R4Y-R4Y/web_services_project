import { z } from "zod";

const getAccountSingleSchema = z.object({
    id: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
})

export type GetAccountSingleInput = z.infer<typeof getAccountSingleSchema>

const buyServiceAccountSchema =  z.object({
    id: z.string({
        required_error: 'Account ID is required',
        invalid_type_error: 'Account ID must be a string',
    }),
    service: z.string({
        required_error: 'Service ID is required',
        invalid_type_error: 'Service ID must be a string',
    })
})

export type BuyServiceAccountInput = z.infer<typeof buyServiceAccountSchema>

const createAccountSchema = z.object({
    id: z.string({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID must be a string',
    }),
    balance: z.number({
        required_error: "Balance is required",
        invalid_type_error: "Balance must be a number"
    }),
    
})

export type CreateAccountInput = z.infer<typeof createAccountSchema>

