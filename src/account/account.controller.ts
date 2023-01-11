import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma, { pageCount } from "../utils/prisma";
import { BuyServiceAccountInput, CreateAccountInput, AccountSingleInput, GetPaginationInput, AccountPaginationInput } from "./account.schema";


export async function GetAccountMultipleHandler(request: FastifyRequest<{Params: GetPaginationInput}>, reply:FastifyReply) {
    try {
        const {user_id} = request.user as {user_id: string}
        const {page} = request.params
        const count = await prisma.account.count({
            where:{owner_id: user_id},
        })
        const data = await prisma.account.findMany({
            where:{owner_id: user_id},
            skip: pageCount*page,
            take: count/(pageCount*page + pageCount) > 1 ? pageCount : count % pageCount,
        })
        reply.code(200).send(data)

    } catch (error) {
        return reply.code(500).send(error)
    }    
}

export async function GetTransactionMultipleHandler(request: FastifyRequest<{Params: AccountPaginationInput}>, reply:FastifyReply) {
    try {
        const {user_id} = request.user as {user_id: string}
        const {page} = request.params
        const count = await prisma.transaction.count({where:{payer_id: user_id}})
        const data = await prisma.transaction.findMany({
            where:{
                payer_id: user_id
            },
            include:{
                payer: true,
                reciever: true,
            },
            skip: pageCount*page,
            take: count/(pageCount*page + pageCount) > 1 ? pageCount : count % pageCount,
        })
        reply.code(200).send(data)
    } catch (error) {
        
    }
}

export async function GetAccountSingleHandler(request: FastifyRequest<{Params: AccountSingleInput}>, reply:FastifyReply) {
    const {id} = request.params
    const {user_id} = request.user as {user_id: string}
    try {
        const data = await prisma.account.findFirst({
            where:{id, owner_id: user_id}
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
        reply.code(201).send(data)
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
        if(!data) return reply.code(204).send({message: "There's no account that exists with this id owned by current user"})
        const newBalance = data.balance - service.price
        if(newBalance < 0) return reply.code(400).send({message: "Budget is insufficient to buy the desired service"})
        // to follow ATOMIC principal (either the entire transaction is succeed or fail as a whole 
        // (customer's transactions are cruicial)
        const [account,transaction] = await prisma.$transaction([
            prisma.account.update({
                where:{id: accountId},
                data:{balance: newBalance}
            }),
            prisma.transaction.create({
                data:{
                    payment: service.price,
                    payer_id: accountId,
                    reciever_id: serviceId
                }
            })
        ])
        return reply.code(201).send(transaction)
    } catch (error) {
        return reply.code(500).send(error)
    }
    
}

export async function DeleteAccountHandler(request: FastifyRequest<{Params: AccountSingleInput}>, reply:FastifyReply) {
    const account_id = request.params.id
    const { id: owner_id } = await request.user as { id: string }
    try {
        const data = await prisma.account.deleteMany({
            where:{id: account_id, owner_id}
        })
        if(!data)reply.code(200).send({message:'Account successfully deleted'})
    } catch (error) {
        return reply.code(500).send(error)
    }

}