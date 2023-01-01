import { FastifyInstance } from "fastify";
import { CreateAccountHandler, DeleteAccountHandler, GetAccountMultipleHandler, GetAccountSingleHandler, BuyServiceAccountHandler } from "./account.controller";

export default async function AccountRoutes(server: FastifyInstance) {
    server.get("/many",{
        preHandler: [server.authenticate]
    },GetAccountMultipleHandler)
    server.get("/one",{
        preHandler: [server.authenticate]
    },GetAccountSingleHandler)
    server.post("/create",{
        preHandler: [server.authenticate]
    },CreateAccountHandler)
    server.post("/buy",{
        preHandler: [server.authenticate]
    },BuyServiceAccountHandler)
    server.delete("/delete",{
        preHandler: [server.authenticate]
    },DeleteAccountHandler)
}