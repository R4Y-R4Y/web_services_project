import { registerUserHandler } from "./user.controller"

// where the routes for the user gets defined

async function userRoutes(fastify) {
    fastify.post("/",registerUserHandler)
}

export default userRoutes