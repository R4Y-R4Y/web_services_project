import { FastifyInstance } from "fastify";
import { GetPlatformMultipleHandler, GetPlatformSingleHandler } from "./platform.controller";


export default async function PlatformRoutes(server: FastifyInstance) {
    server.get("/many",{
        preHandler: [server.authenticate]
    },GetPlatformMultipleHandler)
    server.get("/one",{
        preHandler: [server.authenticate]
    },GetPlatformSingleHandler)
}