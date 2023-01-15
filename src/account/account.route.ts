import { FastifyInstance } from "fastify";
import { CreateAccountHandler, DeleteAccountHandler, GetAccountMultipleHandler, GetAccountSingleHandler, BuyServiceAccountHandler, GetTransactionMultipleHandler, DepositAccountHandler, TransferMoneyAccountHandler, GetPaymentMultipleHandler } from "./account.controller";
import { $ref } from "./account.schema";

export default async function AccountRoutes(server: FastifyInstance) {
    server.get("/many/:page",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a list of accounts",
            params: $ref("getPaginationRequestSchema"),
            tags: ["Account"]
        }
    },GetAccountMultipleHandler)
    server.get("/one/:id",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a single account from the name",
            params: $ref("accountSingleRequestSchema"),
            tags: ["Account"]
        }
    },GetAccountSingleHandler)
    server.get("/payment/:page",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a list of payments",
            params: $ref("getPaginationRequestSchema"),
            tags: ["Account"]
        }
    },GetPaymentMultipleHandler)
    server.get("/transaction/:page",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a list of transactions",
            params: $ref("getPaginationRequestSchema"),
            tags: ["Account"]
        }
    },GetTransactionMultipleHandler)
    server.post("/create",{
        preHandler: [server.authenticate],
        schema:{
            description:"Create an account to store your money in",
            body: $ref("createAccountRequestSchema"),
            tags: ["Account"]
        }
    },CreateAccountHandler)
    server.put("/buy",{
        preHandler: [server.authenticate],
        schema:{
            description:"Buy one of the services",
            body: $ref("buyServiceAccountRequestSchema"),
            tags: ["Account"]
        }
    },BuyServiceAccountHandler)
    server.put("/transfer",{
        preHandler: [server.authenticate],
        schema:{
            description:"Transfer your money from an account to another",
            body: $ref('transferMoneyAccountRequestSchema'),
            tags: ["Account"]
        }
    },TransferMoneyAccountHandler)
    server.put("/deposit/:accountId/:deposit",{
        preHandler: [server.authenticate],
        schema:{
            description:"Deposit a specific amount of money to one of your accounts",
            params:$ref("addDepositRequestSchema"),
            tags: ["Account"]
        }
    },DepositAccountHandler)
    server.delete("/delete/:id",{
        preHandler: [server.authenticate],
        schema:{
            description:"Delete your account",
            params:$ref("accountSingleRequestSchema"),
            tags: ["Account"]
        }
    },DeleteAccountHandler)
}