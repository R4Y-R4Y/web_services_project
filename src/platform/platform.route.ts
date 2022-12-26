import { FastifyInstance } from "fastify";
import { GetPlatformMultipleHandler, GetPlatformSingleHandler } from "./platform.controller";


export default async function PlatformRoutes(server: FastifyInstance) {
    server.get("/",{
        preHandler: [server.authenticate]
    },GetPlatformMultipleHandler)
    server.get("/:id",{
        preHandler: [server.authenticate]
    },GetPlatformSingleHandler)
}