import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma, { pageCount } from "../utils/prisma";
import { BuyServiceAccountInput, CreateAccountInput, AccountSingleInput, GetPaginationInput, AccountPaginationInput, TransferMoneyAccountInput, AddDepositInput, GetMoneyTransferPaginationInput } from "./account.schema";


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

export async function GetTransactionMultipleHandler(request: FastifyRequest<{Params: GetPaginationInput}>, reply:FastifyReply) {
    try {
        const {user_id} = request.user as {user_id: string}
        const {page} = request.params
        const payments = await prisma.transaction.findMany({
            where:{
                OR:[
                    {payer_transaction: {owner:{id: user_id}}},
                    {reciever_transaction:{owner:{id: user_id}}}
                ]     
            },
            include:{
                payer_transaction: true,
                reciever_transaction: true,
            },
        })
        const count = payments.length
        console.log(count)
        if(count < page * pageCount) reply.code(404).send({message:"Maximum Amount reached. Please check previous pages."})
        const data = await prisma.transaction.findMany({
            where:{
                OR:[
                    {payer_transaction: {owner:{id: user_id}}},
                    {reciever_transaction:{owner:{id: user_id}}}
                ]     
            },
            include:{
                payer_transaction: true,
                reciever_transaction: true,
            },
            skip: pageCount*page,
            take: count/(pageCount*page + pageCount) > 1 ? pageCount : count % pageCount,
        })
        reply.code(200).send(data)
    } catch (error) {
        reply.code(500).send(error)
    }
}

export async function GetPaymentMultipleHandler(request: FastifyRequest<{Params: GetPaginationInput}>, reply:FastifyReply) {
    try {
        const {user_id} = request.user as {user_id: string}
        const {page} = request.params
        const payments = await prisma.payment.findMany({
            where:{
                payer_payment: {owner:{id: user_id}}
            },
            include:{
                payer_payment: true,
                reciever_payment: true,
            },
        })
        const count = payments.length
        if(count < page * pageCount) reply.code(404).send({message:"Maximum Amount reached. Please check previous pages."})
        const data = await prisma.payment.findMany({
            where:{
                payer_payment: {owner:{id: user_id}}
            },
            include:{
                payer_payment: true,
                reciever_payment: true,
            },
            skip: pageCount*page,
            take: count/(pageCount*page + pageCount) > 1 ? pageCount : count % pageCount,
        })
        reply.code(200).send(data)
    } catch (error) {
        reply.code(500).send(error)
    }
}

export async function GetAccountSingleHandler(request: FastifyRequest<{Params: GetPaginationInput}>, reply:FastifyReply) {
    const {page} = request.params
    const {user_id} = request.user as {user_id: string}
    try {
        const data = await prisma.account.findMany({
            where:{owner_id: user_id}
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function CreateAccountHandler(request: FastifyRequest<{Body: CreateAccountInput}>, reply:FastifyReply) {
    const body = request.body
    const {user_id} = request.user as {user_id: string}
    try {
        const data = await prisma.account.create({
            data: {
                owner_id:user_id,
                balance: body.balance
            }
        })
        reply.code(201).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function TransferMoneyAccountHandler(request: FastifyRequest<{Body: TransferMoneyAccountInput}>, reply:FastifyReply) {
    const recieverId = request.body.account_reciever_id
    const senderId = request.body.account_sender_id
    const {payment} = request.body
    const { user_id } = await request.user as { user_id: string }
    try {
        console.log(recieverId,senderId)
        if(recieverId === senderId) return reply.code(404).send({message: "You cannot send funds to the same account"})
        const reciever = await prisma.account.findFirst({
            where:{
                id: recieverId
            }
        })
        if(!reciever) return reply.code(404).send({message: "There's no reciever account that exists with this id in our platform"})
        const sender = await prisma.account.findFirst({
            where:{
                owner_id: user_id,
                id: senderId
            }
        })
        if(!sender) return reply.code(404).send({message: "There's no account that exists with this id owned by current user"})
        // to follow ATOMIC principal (either the entire transaction is succeed or fail as a whole 
        // (customer's transactions are cruicial)
        const newSenderBalance = sender.balance - payment
        const newRecieverBalance = reciever.balance + payment
        const [accountSender, accountReciever, transaction] = await prisma.$transaction([
            prisma.account.update({
                where:{id: senderId},
                data:{balance: newSenderBalance}
            }),
            prisma.account.update({
                where:{id: recieverId},
                data:{balance: newRecieverBalance}
            }),
            prisma.transaction.create({
                data:{
                    payment,
                    payer_transaction_id: senderId,
                    reciever_transaction_id: recieverId
                }
            })
        ])
        return reply.code(201).send(transaction)
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}

export async function BuyServiceAccountHandler(request: FastifyRequest<{Body: BuyServiceAccountInput}>, reply:FastifyReply) {
    const accountId = request.body.account_id
    const serviceId = request.body.service_id
    const { user_id } = await request.user as { user_id: string }
    try {
        const service = await prisma.service.findFirst({
            where:{
                id: serviceId
            }
        })
        if(!service) return reply.code(404).send({message: "There's no service that exists with this id in our platform"})
        const data = await prisma.account.findFirst({
            where:{
                owner_id: user_id,
                id: accountId
            }
        })
        if(!data) return reply.code(404).send({message: "There's no account that exists with this id owned by current user"})
        const newBalance = data.balance - service.price
        if(newBalance < 0) return reply.code(400).send({message: "Budget is insufficient to buy the desired service"})
        // to follow ATOMIC principal (either the entire transaction is succeed or fail as a whole 
        // (customer's transactions are cruicial)
        const [account,payment] = await prisma.$transaction([
            prisma.account.update({
                where:{id: accountId},
                data:{balance: newBalance}
            }),
            prisma.payment.create({
                data:{
                    payment: service.price,
                    payer_payment_id: accountId,
                    reciever_payment_id: serviceId
                }
            })
        ])
        return reply.code(201).send(payment)
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
    
}

export async function DepositAccountHandler(request: FastifyRequest<{Params: AddDepositInput}>, reply:FastifyReply) {
    try {
        const {deposit, accountId} = request.params
        const { user_id } = await request.user as { user_id: string }
        const account = await prisma.account.findFirst({
            where:{
                owner_id: user_id,
                id: accountId
            }
        })
        console.log(account)
        if(!account) return reply.code(404).send({message: "There's no account that exists with this id owned by current user"})
        const {balance} = account
        const newBalance = balance + deposit
        const newAccount = await prisma.account.update({
            where:{id: accountId},
            data:{balance: newBalance}
        })
        return reply.code(201).send(newAccount)
    } catch (error) {
        console.log(error)
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