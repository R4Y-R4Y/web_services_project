import { FastifyInstance } from "fastify";
import { GetPlatformMultipleHandler, GetPlatformSingleHandler, GetServiceMultipleHandler, GetServicePlatformHandler, GetServiceSingleHandler } from "./platform.controller";
import { $ref } from "../user/user.schema";


export default async function PlatformRoutes(server: FastifyInstance) {
    server.get("/many",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get user's accounts",
            response:{
                201: $ref("createUserResponseSchema")
            },
            tags: ["User"]
        }
    },GetPlatformMultipleHandler)
    server.get("/one",{
        preHandler: [server.authenticate]
    },GetPlatformSingleHandler)
    server.get("/service",{
        preHandler: [server.authenticate]
    },GetServicePlatformHandler)
    server.get("/service/many",{
        preHandler: [server.authenticate]
    },GetServiceMultipleHandler)
    server.get("/service/one",{
        preHandler: [server.authenticate]
    },GetServiceMultipleHandler)
}