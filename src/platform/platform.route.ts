import { FastifyInstance } from "fastify";
import { GetPlatformMultipleHandler, GetPlatformSingleHandler, GetServiceMultipleHandler, GetServicePlatformHandler, GetServiceSingleHandler } from "./platform.controller";
import { $ref } from "../user/user.schema";


export default async function PlatformRoutes(server: FastifyInstance) {
    server.get("/many/:name/:page",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a list of platforms",
            response:{
                201: $ref("createUserResponseSchema")
            },
            tags: ["Platform"]
        }
    },GetPlatformMultipleHandler)
    server.get("/one/:name",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a single platform that contains the name that you want",
            response:{
                201: $ref("createUserResponseSchema")
            },
            tags: ["Platform"]
        }
    },GetPlatformSingleHandler)
    server.get("/service-platform/:name",{
        preHandler: [server.authenticate]
    },GetServicePlatformHandler)
    server.get("/service/many/:name/:page",{
        preHandler: [server.authenticate]
    },GetServiceMultipleHandler)
    server.get("/service/one/:name",{
        preHandler: [server.authenticate]
    },GetServiceSingleHandler)
}