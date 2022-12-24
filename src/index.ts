
import fastify from "fastify"

import dotenv from 'dotenv'
import userRoutes from "./user/user.route"

dotenv.config()

const server = fastify({
  logger: true
})

server.get("/healthcheck",()=>{
  return{status:"ok"}
})

async function main() {
  server.register(userRoutes,{prefix:'api/users'})
  await server.listen({port: Number(process.env.PORT),host:"localhost"},(err,address) =>{
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}


main()