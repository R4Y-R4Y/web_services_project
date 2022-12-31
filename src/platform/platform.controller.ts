import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import prisma from "../utils/prisma";
import { GetPlatformSingleInput } from "./platform.schema";

export async function GetPlatformMultipleHandler(request: FastifyRequest, reply:FastifyReply) {
    try {
        const data = await prisma.platform.findMany({take: 10})
        reply.code(200).send(data)

    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetPlatformSingleHandler(request: FastifyRequest<{Body: GetPlatformSingleInput}>, reply:FastifyReply) {
    const body = request.body
    try {
        const data = await prisma.platform.findFirst({
            where:{ name: body.name }
        })
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}