import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma, { pageCount } from "../utils/prisma";
import { GetContentInput, GetContentPaginationInput } from "./platform.schema";


export async function GetPlatformMultipleHandler(request: FastifyRequest<{Params: GetContentPaginationInput}>, reply:FastifyReply) {
    try {
        const{name,page} = request.params
        const count = await prisma.platform.count({where:{name}})
        if(count < page * pageCount) reply.code(200).send({message:"No results found"})
        const data = await prisma.platform.findMany({
            where:{name},
            skip: pageCount*page,
            take: pageCount
        })
        reply.code(200).send(data)

    } catch (error) {
        return reply.code(500).send(error)
    }
}
export async function GetPlatformSingleHandler(request: FastifyRequest<{Body: GetContentInput}>, reply:FastifyReply) {
    const {name} = request.body
    try {
        const data = await prisma.platform.findFirst({
            where:{ 
                name: {contains: name, mode:"insensitive"}
            }
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetServiceMultipleHandler(request: FastifyRequest<{Params: GetContentPaginationInput}>, reply:FastifyReply) {
    try {
        const{name,page} = request.params
        const count = await prisma.platform.count({where:{name}})
        if(count < page * pageCount) reply.code(200).send({message:"No results found"})
        const data = await prisma.service.findMany({
            where:{ 
                name: {contains: name, mode:"insensitive"}
            },
            skip: pageCount*page,
            take: pageCount
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetServiceSingleHandler(request: FastifyRequest<{Body: GetContentInput}>, reply:FastifyReply) {
    const body = request.body
    try {
        const data = await prisma.service.findFirst({
            where:{ 
                name: {contains: body.name, mode:"insensitive"}
            }
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetServicePlatformHandler(request: FastifyRequest<{Params: GetContentInput}>, reply:FastifyReply) {
    const {name} = request.params
    try {
        const data = await prisma.service.findFirst({
            where:{ 
                platform:{
                    name:{contains: name, mode:"insensitive"}
                },
            },
            include:{
                platform: true
            }
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}