
import fastify from "fastify"

import dotenv from 'dotenv'
import userRoutes from "./user/user.route"
import exp from "constants"

dotenv.config()

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any
  }
}

const server = fastify({
  logger: true
})

server.get("/healthcheck",()=>{
  return{status:"ok"}
})

async function main() {
  server.register(userRoutes,{prefix:'api/users'})
  server.register(userRoutes,{prefix:'api/accounts'})
  await server.listen({port: Number(process.env.PORT),host:"localhost"},(err,address) =>{
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}


main()