import { FastifyInstance } from "fastify"
import { GetUserHandler, RefreshUserHandler, SignInUserHandler, UpdateUserHandler, registerUserHandler } from "./user.controller"

// where the routes for the user gets defined

export default async function UserRoutes(server: FastifyInstance) {
    server.post("/register",registerUserHandler)
    server.post("/signin",SignInUserHandler)
    server.put("/refresh",{
        preHandler:[server.authenticate]
    },RefreshUserHandler)
    server.patch("/update",{
        preHandler:[server.authenticate]
    },UpdateUserHandler)
    server.get("/",{
        preHandler:[server.authenticate]
    },GetUserHandler)
}

