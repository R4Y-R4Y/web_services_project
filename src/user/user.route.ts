import { FastifyInstance } from "fastify"
import { registerUserHandler } from "./user.controller"

// where the routes for the user gets defined

export default async function userRoutes(server: FastifyInstance) {
    server.post("/",registerUserHandler)
}

