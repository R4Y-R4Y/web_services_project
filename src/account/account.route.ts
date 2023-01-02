import { FastifyInstance } from "fastify";
import { CreateAccountHandler, DeleteAccountHandler, GetAccountMultipleHandler, GetAccountSingleHandler, BuyServiceAccountHandler, GetTransactionMultipleHandler } from "./account.controller";

export default async function AccountRoutes(server: FastifyInstance) {
    server.get("/many",{
        preHandler: [server.authenticate],
        schema:{
            tags: ["Account"]
        }
    },GetAccountMultipleHandler)
    server.get("/transaction/:page",{
        preHandler: [server.authenticate],
        schema:{
            params:{
                type:'object',
                properties:{
                    page:{type: 'integer', default:0}
                }
            },
            tags: ["Account"]
        }
    },GetTransactionMultipleHandler)
    server.get("/one/:id",{
        preHandler: [server.authenticate],
        schema:{
            params:{
                type:'object',
                properties:{
                    id:{type: 'string', format:'uuid'}
                }
            },
            tags: ["Account"]
        }
    },GetAccountSingleHandler)
    server.post("/create",{
        preHandler: [server.authenticate],
        schema:{
            tags: ["Account"]
        }
    },CreateAccountHandler)
    server.put("/buy/",{
        preHandler: [server.authenticate],
        schema:{
            tags: ["Account"]
        }
    },BuyServiceAccountHandler)
    server.delete("/delete/:id",{
        preHandler: [server.authenticate],
        schema:{
            params:{
                type:'object',
                properties:{
                    id:{type: 'string', format:'uuid'}
                }
            },
            tags: ["Account"]
        }
    },DeleteAccountHandler)
}