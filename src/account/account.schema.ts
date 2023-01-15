import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const accountSingleRequestSchema = z.object({
    id: z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
    }),
})
const accountPaginationRequestSchema = z.object({
    name: z.string({
        required_error: 'ID is required',
        invalid_type_error: 'ID must be a string',
    }),
    page: z.number({
        required_error: 'Page is required',
        invalid_type_error: 'Page must be a number',
    }),
})

export type AccountPaginationInput = z.infer<typeof accountPaginationRequestSchema>

export type AccountSingleInput = z.infer<typeof accountSingleRequestSchema>

export type AccountMultipleInput = z.infer<typeof createAccountRequestSchema>

const buyServiceAccountRequestSchema =  z.object({
    account_id: z.string({
        required_error: 'Account ID is required',
        invalid_type_error: 'Account ID must be a string',
    }),
    service_id: z.string({
        required_error: 'Service ID is required',
        invalid_type_error: 'Service ID must be a string',
    })
})
export type BuyServiceAccountInput = z.infer<typeof buyServiceAccountRequestSchema>

const transferMoneyAccountRequestSchema = z.object({
    account_reciever_id: z.string({
        required_error: 'Account ID is required',
        invalid_type_error: 'Account ID must be a string',
    }),
    account_sender_id: z.string({
        required_error: 'Account ID is required',
        invalid_type_error: 'Account ID must be a string',
    }),
    payment: z.number({
        required_error: 'Payment is required',
        invalid_type_error: 'Payment must be a number',
    })
})
export type TransferMoneyAccountInput = z.infer<typeof transferMoneyAccountRequestSchema>

const createAccountRequestSchema = z.object({
    balance: z.number({
        required_error: "Balance is required",
        invalid_type_error: "Balance must be a number"
    }),
    
})

export type CreateAccountInput = z.infer<typeof createAccountRequestSchema>

const getPaginationRequestSchema = z.object({
    page: z.number({
        required_error: 'Page is required',
        invalid_type_error: 'Page must be a number',
    })
})

export type GetPaginationInput = z.infer<typeof getPaginationRequestSchema>

const getAccountSingleResponseSchema = z.object({
    id: z.string(),
    balance: z.number(),
    payer: z.object({}).array(),
    reciever: z.object({}).array(),
    owner_id: z.string(),
    owner:z.object({})
})

const getAccountMultipleResponseSchema = z.array(
    getAccountSingleResponseSchema
)

const getTransactionMultipleResponseSchema = z.object({
    id: z.string(),
    payment: z.number(),
    payer: z.object({}),
    reciever: z.object({}),
})

export const { schemas: accountSchemas, $ref } = buildJsonSchemas({
    accountSingleRequestSchema,
    accountPaginationRequestSchema,
    createAccountRequestSchema,
    transferMoneyAccountRequestSchema,
    buyServiceAccountRequestSchema,
    getPaginationRequestSchema,
    getAccountMultipleResponseSchema,
    getAccountSingleResponseSchema,
    getTransactionMultipleResponseSchema
},{$id: "Account", target:'openApi3'});
