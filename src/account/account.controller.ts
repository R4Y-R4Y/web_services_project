import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma from "../utils/prisma";
import { BuyServiceAccountInput, CreateAccountInput } from "./account.schema";


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
        return reply.code(500).send(error)
    }
}

export async function BuyServiceAccountHandler(request: FastifyRequest<{Body: BuyServiceAccountInput}>, reply:FastifyReply) {
    const accountId = request.body.id
    const serviceId = request.body.service
    const { id } = await request.user as { id: string }
    try {
        const service = await prisma.service.findFirst({
            where:{
                id: serviceId
            }
        })
        if(!service) return reply.code(204).send({message: "There's no service that exists with this id in our platform"})
        const data = await prisma.account.findFirst({
            where:{
                owner_id: id,
                id: accountId
            }
        })
        if(!data) return reply.code(204).send({message: "There's no account that exists with this id for the current user"})
        const newBalance = data.balance - service.price
        if(newBalance < 0) return reply.code(400).send({message: "Budget is insufficient to buy the desired service"})
        const result = await prisma.account.update({
            where:{id: accountId},
            data:{balance: newBalance}
        })
        return reply
    } catch (error) {
        return reply.code(500).send(error)
    }
    
}

export async function DeleteAccountHandler(request: FastifyRequest<{Body: CreateAccountInput}>, reply:FastifyReply) {
    
}