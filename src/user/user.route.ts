import { FastifyInstance } from "fastify"
import { GetUserHandler, SignInUserHandler, SignOutUserHandler, UpdateUserHandler, registerUserHandler } from "./user.controller"

// where the routes for the user gets defined

export default async function userRoutes(server: FastifyInstance) {
    server.post("/register",registerUserHandler)
    server.post("/signin",SignInUserHandler)
    server.post("/signout",SignOutUserHandler)
    server.post("/update",UpdateUserHandler)
    server.get("/get",{
        
    },GetUserHandler)
}

