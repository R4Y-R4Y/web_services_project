import { FastifyInstance } from "fastify";
import { GetAccountMultipleHandler, GetAccountSingleHandler } from "./account.controller";

export default async function AccountRoutes(server: FastifyInstance) {
    server.get("/many",{
        preHandler: [server.authenticate]
    },GetAccountMultipleHandler)
    server.get("/one",{
        preHandler: [server.authenticate]
    },GetAccountSingleHandler)
    server.get("/create",{
        preHandler: [server.authenticate]
    },GetAccountSingleHandler)
    server.get("/update",{
        preHandler: [server.authenticate]
    },GetAccountSingleHandler)
    server.get("/delete",{
        preHandler: [server.authenticate]
    },GetAccountSingleHandler)
}