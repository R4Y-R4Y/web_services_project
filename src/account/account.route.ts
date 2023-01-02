import { FastifyInstance } from "fastify";
import { CreateAccountHandler, DeleteAccountHandler, GetAccountMultipleHandler, GetAccountSingleHandler, BuyServiceAccountHandler, GetTransactionMultipleHandler } from "./account.controller";

export default async function AccountRoutes(server: FastifyInstance) {
    server.get("/many",{
        preHandler: [server.authenticate]
    },GetAccountMultipleHandler)
    server.get("/transaction/:page",{
        preHandler: [server.authenticate]
    },GetTransactionMultipleHandler)
    server.get("/one/:id",{
        preHandler: [server.authenticate]
    },GetAccountSingleHandler)
    server.post("/create",{
        preHandler: [server.authenticate]
    },CreateAccountHandler)
    server.put("/buy/",{
        preHandler: [server.authenticate]
    },BuyServiceAccountHandler)
    server.delete("/delete/:id",{
        preHandler: [server.authenticate]
    },DeleteAccountHandler)
}