import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { RefreshInput, RegisterUserInput, SigninUserInput, UpdateUserInput } from "./user.schema";
import { hashPassword, verifyPassword } from "../utils/password";
import prisma from "../utils/prisma";
import { server } from "..";

export async function registerUserHandler(request :FastifyRequest<{Body: RegisterUserInput}>, reply:FastifyReply) {
    const body = request.body;
    try {
        const { password, name, email } = body;
        const hash = await hashPassword(password);
        const verify = await prisma.user.findFirst({
            where:{email}
        })
        if(verify) reply.code(400).send({code:400 ,message: "There's already a user with this email address."});
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: hash,
            },
            select:{
                id: true,
                name: true,
                email: true
            }
        });
        reply.code(201).send(user)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function SignInUserHandler(request: FastifyRequest<{Body: SigninUserInput}>, reply: FastifyReply) {
    const body = request.body
    try{
        const user = await prisma.user.findUnique({
            where:{
                email: body.email
            }
        })
        console.log(user)
        if (!user) {
            return reply.code(401).send({code:401 ,message: "Sign in failed. Your password or email is invalid."});
        }
        const { password,  ...info } = user;
        const correctPassword = await verifyPassword(body.password,password)
        if(correctPassword){
            await prisma.session.deleteMany({
                where:{user_id: info.id}
            })
            const session = await prisma.session.create({
                data:{    
                    user_id: info.id,
                },
                select:{
                    id: true,
                    user_id: true
                }
            })
            const refreshTokenInfo = {...session, refresh: true}
            const accessTokenInfo = {...session, access: true}
            const accessToken = server.jwt.sign(accessTokenInfo,{expiresIn: "15m"})
            const refreshToken = server.jwt.sign(refreshTokenInfo,{expiresIn:"168h"})
            return reply.code(201).send({accessToken, refreshToken,...info})
        } else {
            return reply.code(401).send({code:401 ,message: "Sign in failed. Your password or email is invalid."})
        }
    } catch(error) {
        // @ts-ignore
        console.log(error.message)
        return reply.code(500).send(error)
    }
}

export async function RefreshUserHandler(request: FastifyRequest<{Body: RefreshInput}>, reply: FastifyReply) {
    try {
        const decoded : {id: string, user_id: string, refresh: boolean, iat: number, exp: number} = await server.jwt.verify(request.body.refreshToken)
        if(!decoded.refresh) return reply.code(400).send({message: "This is not a refresh token."})
        const {id, user_id} = decoded
        const session_db = await prisma.session.findUnique({
            where:{id}
        })
        if(!session_db) return reply.code(401).send({message: "There's no session with the given refresh token."})
        await prisma.session.delete({
            where:{user_id}
        })
        const session = await prisma.session.create({
            data:{user_id}
        })
        const accessTokenInfo = {...session,  access: true}
        const refreshTokenInfo = {...session, refresh: true}
        const accessToken = server.jwt.sign(accessTokenInfo,{expiresIn: "15m"})
        const refreshToken = server.jwt.sign(refreshTokenInfo,{expiresIn:"168h"})
        return reply.code(201).send({accessToken, refreshToken})
    } catch (error) {
        // @ts-ignore
        console.log(error.message)
        return reply.code(500).send(error)
    }
}

export async function UpdateUserHandler(request: FastifyRequest<{Body: UpdateUserInput}>,reply: FastifyReply) {
    const { email, password, currentEmail, currentPassword, name } = request.body
    const { user_id } = await request.user as { user_id: string }
    var change = false
    try {
        if(currentEmail && email) {
            const dbCurrentMail = await prisma.user.findUnique({
                where:{email: currentEmail},
            })
            if(!dbCurrentMail) return reply.code(400).send({message: "The email you typed is not the current email. Please type the current email."})
            await prisma.user.update({
                where:{id: user_id},
                data:{email}
            })
            change = true
        }
        if(currentPassword && password){
            const dbUser = await prisma.user.findUnique({
                where:{id: user_id}
            })
            // @ts-ignore
            const verify = await verifyPassword(currentPassword,dbUser?.password)
            if(verify) return reply.code(400).send({message: "The password you typed is not the current password. Please type the current password."})
            const hash = await hashPassword(currentPassword)
            await prisma.user.update({
                where:{id: user_id},
                data:{password: hash}
            })
            change = true
        }
        if(name){
            await prisma.user.update({
                where:{id: user_id},
                data:{name}
            })
        }
        if(change) {
            const user = await prisma.user.findUnique({
                where:{
                    id: user_id
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            })
            reply.code(200).send({message: "Successfully changed email"})
        }
        reply.code(400).send({message: "Please fill in some of the information"})
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetUserHandler(request: FastifyRequest<any>, reply: FastifyReply) {
    try {
        const { user_id } = await request.user as { user_id: string }
        console.log(user_id)
        const result = await prisma.user.findUnique({
            where:{
                id: user_id
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        })
        reply.code(200).send(result)
    } catch (error) {
        return reply.code(500).send(error)
    }
}
