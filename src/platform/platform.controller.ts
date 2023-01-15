import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma, { pageCount } from "../utils/prisma";
import { GetContentInput, GetContentPaginationInput } from "./platform.schema";


export async function GetPlatformMultipleHandler(request: FastifyRequest<{Params: GetContentPaginationInput}>, reply:FastifyReply) {
    try {
        const{name,page} = request.params
        const count = await prisma.platform.count({
            where:{
                name: {contains: name, mode:"insensitive"}
            }
        })
        console.log(count)
        if(count < page * pageCount) reply.code(404).send({message:"No results in this page. Please check previous pages."})
        const data = await prisma.platform.findMany({
            where:{
                name: {contains: name, mode:"insensitive"}
            },
            skip: pageCount*page,
            take: count/(pageCount*page + pageCount) > 1 ? pageCount : count % pageCount
        })
        reply.code(200).send(data)

    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}
export async function GetPlatformSingleHandler(request: FastifyRequest<{Params: GetContentInput}>, reply:FastifyReply) {
    const {name} = request.params
    try {
        const data = await prisma.platform.findFirst({
            where:{ 
                name: {contains: name, mode:"insensitive"}
            }
        })
        if(!data) reply.code(404).send({message: "there's no result with the given name."})
        reply.code(200).send(data)
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}

export async function GetServiceMultipleHandler(request: FastifyRequest<{Params: GetContentPaginationInput}>, reply:FastifyReply) {
    try {
        const{name,page} = request.params
        const count = await prisma.platform.count({
            where:{
                name: {contains: name, mode:"insensitive"}
            }
        })
        if(count < page * pageCount) reply.code(404).send({message:"Maximum Amount reached. Please check previous pages."})
        const data = await prisma.service.findMany({
            where:{ 
                name: {contains: name, mode:"insensitive"}
            },
            skip: pageCount*page,
            take: count/(pageCount*page + pageCount) > 1 ? pageCount : count % pageCount,
            include:{
                platform: true
            },
        })
        reply.code(200).send(data)
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}

export async function GetServiceSingleHandler(request: FastifyRequest<{Params: GetContentInput}>, reply:FastifyReply) {
    const body = request.params
    try {
        const data = await prisma.service.findFirst({
            where:{ 
                name: {contains: body.name, mode:"insensitive"}
            },
            include:{
                platform: true
            }
        })
        if(!data) reply.code(404).send({message: "There's no result with the given name in this."})
        reply.code(200).send(data)
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}

export async function GetServicePlatformHandler(request: FastifyRequest<{Params: GetContentPaginationInput}>, reply:FastifyReply) {
    const {name,page} = request.params
    try {
        const count = await prisma.service.count({
            where:{ 
                platform:{
                    name:{contains: name, mode:"insensitive"}
                },
            },
        })
        console.log(count)
        console.log(count)
        console.log(count)
        console.log(count)
        if(count < page * pageCount) reply.code(404).send({message:"Maximum Amount reached. Please check previous pages."})
        const data = await prisma.service.findMany({
            where:{ 
                platform:{
                    name:{contains: name, mode:"insensitive"}
                },
            },
            skip: pageCount*page,
            take: count/(pageCount*page + pageCount) > 1 ? pageCount : count % pageCount,
            include:{
                platform: true
            }
        })
        reply.code(200).send(data)
    } catch (error) {
        // @ts-ignore
        console.log(error.message)
        return reply.code(500).send(error)
    }
}