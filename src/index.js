import userRoutes from './user/user.route'

const fastify = require('fastify')({logger: true})
const appEnv = require('@fastify/env')


const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    }
  }
}

const options = {
  confKey: 'config',
  dotenv: true,
  schema,
  data: process.env
}

fastify.get("/healthcheck",async (req,res)=>{
  return{status: "OK"}
})

const start = async () => {
  fastify.register(userRoutes, {prefix: "api/users"})
  fastify.register(appEnv, options)
  fastify.listen({ port: fastify.config.PORT, host: '0.0.0.0'}, (err, address) => {
    if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  })  
}

start()