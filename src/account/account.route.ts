import { FastifyInstance } from "fastify";
import { CreateAccountHandler, DeleteAccountHandler, GetAccountMultipleHandler, GetAccountSingleHandler, BuyServiceAccountHandler, GetTransactionMultipleHandler } from "./account.controller";
import { $ref } from "./account.schema";

export default async function AccountRoutes(server: FastifyInstance) {
    server.get("/many",{
        preHandler: [server.authenticate],
        schema:{
            tags: ["Account"]
        }
    },GetAccountMultipleHandler)
    server.get("/transaction/:name/:page",{
        preHandler: [server.authenticate],
        schema:{
            params: $ref("getPaginationRequestSchema"),
            tags: ["Account"]
        }
    },GetTransactionMultipleHandler)
    server.get("/one/:id",{
        preHandler: [server.authenticate],
        schema:{
            params: $ref("accountSingleRequestSchema"),
            tags: ["Account"]
        }
    },GetAccountSingleHandler)
    server.post("/create",{
        preHandler: [server.authenticate],
        schema:{
            body: $ref("createAccountRequestSchema"),
            tags: ["Account"]
        }
    },CreateAccountHandler)
    server.put("/buy/",{
        preHandler: [server.authenticate],
        schema:{
            body: $ref("buyServiceAccountRequestSchema"),
            tags: ["Account"]
        }
    },BuyServiceAccountHandler)
    server.delete("/delete/:id",{
        preHandler: [server.authenticate],
        schema:{
            params:$ref("accountSingleRequestSchema"),
            tags: ["Account"]
        }
    },DeleteAccountHandler)
}