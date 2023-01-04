import { FastifyInstance } from "fastify"
import { GetUserHandler, RefreshUserHandler, SignInUserHandler, UpdateUserHandler, registerUserHandler } from "./user.controller"
import { $ref } from "./user.schema"

// where the routes for the user gets defined

export default async function UserRoutes(server: FastifyInstance) {
    server.post("/register",{
        schema:{
            description:"Register a user to our platform",
            body: $ref("createUserSchema"),            
            security:[],
            response:{
                201: $ref("createUserResponseSchema")
            },
            tags: ["User"]
        }
    },registerUserHandler)
    server.post("/signin",{
        schema:{
            description:"Sign in user and give the access and refresh tokens",
            body: $ref("loginRequestSchema"),
            security:[],
            response:{
                201: $ref("loginResponseSchema")
            },
            tags: ["User"]
        }
    },SignInUserHandler)
    server.put("/refresh",{
        schema:{
            description:"Refresh access and refresh tokens",
            body: $ref("refreshSchema"),
            security:[],
            response:{
                201: $ref("loginResponseSchema")
            },
            tags: ["User"]
        }
    },RefreshUserHandler)
    server.patch("/update",{
        preHandler:[server.authenticate],
        schema:{
            description:"Update user credentials",
            body: $ref("updateUserRequestSchema"),
            response:{
                201: $ref("createUserResponseSchema")
            },
            tags: ["User"],
        }
    },UpdateUserHandler)
    server.get("/",{
        preHandler:[server.authenticate],
        schema:{
            description:"Get user's accounts",
            response:{
                201: $ref("createUserResponseSchema")
            },
            tags: ["User"]
        }
    },GetUserHandler)
}

