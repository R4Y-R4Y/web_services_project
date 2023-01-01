import Fastify, {FastifyRequest,FastifyReply} from "fastify"
import dotenv from 'dotenv'
import UserRoutes from "./user/user.route"
import AccountRoutes from "./account/account.route"
import fjwt, {JWT} from '@fastify/jwt'
import { userSchemas } from "./user/user.schema"
import PlatformRoutes from "./platform/platform.route"

dotenv.config()

// changed class structure to use my custom function and parameters for jwt
declare module "fastify"{
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any
  }
}

export const server = Fastify({
  logger: true
})

server.get("/healthcheck",()=>{
  return{status:"ok"}
})

async function main() {
  server.register(UserRoutes,{prefix:'api/user'})
  server.register(AccountRoutes,{prefix:'api/account'})
  server.register(PlatformRoutes,{prefix:'api/platform'})
  server.register(fjwt,{
    secret: String(process.env.JWT_SECRET),

  })
  for (const schema of [...userSchemas]) {
    server.addSchema(schema);
  }
  // function to use for jwt verification
  server.decorate("authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        
        return await request.jwtVerify();
      } catch (e) {
        return reply.send(e);
      }
    }
  );
  await server.listen({port: Number(process.env.PORT),host:"localhost"},(err,address) =>{
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}



main()