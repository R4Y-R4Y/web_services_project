import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma from "../utils/prisma";
import { GetContentInput } from "./platform.schema";


export async function GetPlatformMultipleHandler(request: FastifyRequest, reply:FastifyReply) {
    try {
        const data = await prisma.platform.findMany({take: 10})
        reply.code(200).send(data)

    } catch (error) {
        return reply.code(500).send(error)
    }
}
export async function GetPlatformSingleHandler(request: FastifyRequest<{Body: GetContentInput}>, reply:FastifyReply) {
    const body = request.body
    try {
        const data = await prisma.platform.findFirst({
            where:{ 
                name: {contains: body.name, mode:"insensitive"}
            }
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetServiceMultipleHandler(request: FastifyRequest<{Body: GetContentInput}>, reply:FastifyReply) {
    const body = request.body
    try {
        const data = await prisma.service.findMany({
            where:{ 
                name: {contains: body.name, mode:"insensitive"}
            }
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

export async function GetServicePlatformHandler(request: FastifyRequest<{Body: GetContentInput}>, reply:FastifyReply) {
    const body = request.body
    try {
        const data = await prisma.service.findFirst({
            where:{ 
                platform:{
                    name:{contains: body.name, mode:"insensitive"}
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