import { FastifyInstance } from "fastify";
import { GetAccountMultipleHandler } from "./account.controller";


export default async function AccountRoutes(server: FastifyInstance) {
    server.get("/",{
        preHandler: [server.authenticate]
    },GetAccountMultipleHandler)
    //server.get("/")
}