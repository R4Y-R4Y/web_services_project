import { registerUserHandler } from "./user.controller"

async function userRoutes(fastify) {
    fastify.post("/",registerUserHandler)
}

export default userRoutes