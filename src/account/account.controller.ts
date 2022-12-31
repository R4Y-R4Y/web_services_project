import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma from "../utils/prisma";
import { CreateAccountInput } from "./account.schema";


export async function GetAccountMultipleHandler(request: FastifyRequest, reply:FastifyReply) {
    try {
        const data = await prisma.account.findMany({take: 10})
        reply.code(200).send(data)

    } catch (error) {
        return reply.code(500).send(error)
    }    
}

export async function GetAccountSingleHandler(request: FastifyRequest<{Body: CreateAccountInput}>, reply:FastifyReply) {
    const body = request.body
    try {
        const data = await prisma.account.findUnique({
            where:{id: body.id}
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function CreateAccountHandler(request: FastifyRequest<{Body: CreateAccountInput}>, reply:FastifyReply) {
    const body = request.body
    try {
        const data = await prisma.account.create({
            data: {
                owner_id: body.id,
                balance: body.balance
                
            }
        })
    } catch (error) {
        
    }
}