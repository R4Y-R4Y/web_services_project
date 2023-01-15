import { FastifyInstance } from "fastify";
import { GetPlatformMultipleHandler, GetPlatformSingleHandler, GetServiceMultipleHandler, GetServicePlatformHandler, GetServiceSingleHandler } from "./platform.controller";
import { $ref } from "./platform.schema";

export default async function PlatformRoutes(server: FastifyInstance) {
    server.get("/many/:name/:page",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a list of platforms",
            params: $ref("getContentPaginationSchema"),
            response:{
                201: $ref("getPlatformListResponse")
            },
            tags: ["Platform"]
        }
    },GetPlatformMultipleHandler)
    server.get("/one/:name",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a single platform from the name",
            params: $ref("getContentSchema"),
            response:{
                201: $ref("getPlatformUniqueResponse")
            },
            tags: ["Platform"]
        }
    },GetPlatformSingleHandler)
    server.get("/service-platform/:name/:page",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get the services of a platform that you want to find",
            params: $ref("getContentPaginationSchema"),
            response:{
                201: $ref("getServiceMultipleResponse")
            },
            tags: ["Platform"]
        }
    },GetServicePlatformHandler)
    server.get("/service/many/:name/:page",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a list of services",
            params: $ref("getContentPaginationSchema"),
            response:{
                201: $ref("getServiceMultipleResponse")
            },
            tags: ["Platform"]
        }
    },GetServiceMultipleHandler)
    server.get("/service/one/:name",{
        preHandler: [server.authenticate],
        schema:{
            description:"Get a single service from the name",
            params: $ref("getContentSchema"),
            response:{
                201: $ref("getServiceUniqueResponse")
            },
            tags: ["Platform"]
        }
    },GetServiceSingleHandler)
}