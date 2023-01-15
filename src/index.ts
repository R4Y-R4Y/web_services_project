import Fastify, {FastifyRequest,FastifyReply} from "fastify"
import dotenv from 'dotenv'
import UserRoutes from "./user/user.route"
import AccountRoutes from "./account/account.route"
import fjwt, {JWT} from '@fastify/jwt'
import { userSchemas } from "./user/user.schema"
import fastifySwaggerUi from "@fastify/swagger-ui"
import PlatformRoutes from "./platform/platform.route"
import {version} from "../package.json" 
import swagger from "@fastify/swagger"
import { withRefResolver } from "fastify-zod"
import prisma from "./utils/prisma"
import { platformSchemas } from "./platform/platform.schema"
import { accountSchemas } from "./account/account.schema"
import AdminRoutes from "./admin/admin.route"
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

async function main() {
  
  server.register(fjwt,{secret: String(process.env.JWT_SECRET)})
  server.register(fjwt, {
    secret: String(process.env.EMAIL_JWT_SECRET),
    namespace: 'email',
  })
  server.register(fjwt, {
    secret: String(process.env.ADMIN_JWT_SECRET),
    namespace: 'admin',
  })
  server.register(swagger,withRefResolver({
    routePrefix: "/documentation",
    exposeRoute: true,
    staticCSP: true,
    openapi: {
      security:[{authorizationToken:[]}],
      components:{
        securitySchemes:{
          authorizationToken:{
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      info:{
        title:"Money saving and Budgeting API",
        description:"This money saving API is designed to help users manage their finances and make smarter decisions about how to save and spend their money. With the API, users can connect their bank accounts and credit cards, and track their spending in real-time. The API also offers budgeting tools and allows users to buy services from platforms. Additionally, the API provides suggestions for how to save and invest for the long term.",
        version 
      },
      tags:[
        {
          name: "User",
          description: "Everything about the User"
        },
        {
          name: "Platform",
          description: "Access Platform's informations and their services"
        },
        {
          name: "Account",
          description: "Access the user's accounts and do transactions"
        },
        {
          name: "Admin",
          description: "Admin access to do CRUD operations into database easily"
        },

      ]
    },
  }))
  server.register(fastifySwaggerUi,{
    routePrefix: "/documentation",
    initOAuth: {},
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request: FastifyRequest, reply:FastifyReply, next: Function) {
        next();
      },
      preHandler: function (request: FastifyRequest, reply:FastifyReply, next: Function) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })
  for (const schema of [...userSchemas, ...platformSchemas, ...accountSchemas]) {
    server.addSchema(schema);
  }
  server.register(UserRoutes,{prefix:'api/user'})
  server.register(AccountRoutes,{prefix:'api/account'})
  server.register(PlatformRoutes,{prefix:'api/platform'})
  server.register(AdminRoutes,{prefix:'api/admin'})
  // function to use for jwt verification
  server.decorate("authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if(!request.headers.authorization && !request.headers.authorization?.startsWith('Bearer '))  reply.code(401).send({message: "There's no bearer token. Please add a bearer token"})
        const token = await request.jwtVerify()
        if(!(token as {id: string}).id)  reply.code(401).send({message: 'No session value'})
        if(!(token as {access: boolean}).access) reply.code(401).send({message: 'This is not an access token'})      
        const session = await prisma.session.findUnique({
          where:{id: (token as {id: string}).id}
        })
        if(!session) throw {message: "There's no valid session in the token"}
        return token
      } catch (e) {
        return reply.send(e);
      }
    }
  );
  await server.listen({port: Number(process.env.PORT),host:String(process.env.HOST)},(err,address) =>{
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
    console.log(`Swagger documentation available at: ${address}/documentation`)
  })
}



main()