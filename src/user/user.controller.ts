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
            return reply.code(401).send({
                message: "Invalid email or password",
            });
        }

        const { password,  ...info } = user;
        const correctPassword = await verifyPassword(body.password,password)
        if(correctPassword){
            prisma.session.updateMany({
                where:{valid: true, user_id: info.id},
                data:{valid: false}
            })
            const session = await prisma.session.create({
                data:{
                    user_id: info.id,
                    valid:true,
                },
                select:{
                    id: true,
                    user_id: true
                }
            })
            const refreshTokenInfo = {
                user_id: info.id,
                session_id: session.id
            }
            const accessTokenInfo = {...refreshTokenInfo, access: true}
            const accessToken = server.jwt.sign(accessTokenInfo,{expiresIn: "15m"})
            const refreshToken = server.jwt.sign(refreshTokenInfo,{expiresIn:"168h"})
            return reply.code(201).send({accessToken, refreshToken,...info})
        } else {
            return reply.code(401).send({message: "Sign in failed. Your password or email is invalid."})
        }
    } catch(error) {
        return reply.code(500).send(error)
    }
}

export async function RefreshUserHandler(request: FastifyRequest<{Body: RefreshInput}>, reply: FastifyReply) {
    try {
        // @ts-ignore
        const decoded : {session_id: string, user_id: string, iat: number, exp: number} = await server.jwt.verify(request.body.accessToken)
        const session_id = decoded.session_id
        const user_id = decoded.user_id
        const session_db = await prisma.session.findUnique({
            where:{id: session_id}
        })
        if(!session_db) return reply.code(401).send({message: "There's no session with the given refresh token."})
        if(session_db.valid == false) return reply.code(401).send({message: "This refresh token is already expired."})
        await prisma.session.updateMany({
            where:{user_id},
            data:{valid: {set: false}}
        })
        await prisma.session.deleteMany({
            where:{user_id,valid:false}
        })
        const session = await prisma.session.create({
            data:{
                user_id,
                valid: true,
            },
            
        })
        const info = await prisma.user.findUnique({
            where:{id: user_id},
            select:{
                id: true,
                email: true,
                name: true
            }
        })
        // @ts-ignore
        const accessToken = server.jwt.sign(info,{expiresIn: "15m"})
        const refreshToken = server.jwt.sign(session,{expiresIn:"168h"})
        return reply.code(201).send({accessToken, refreshToken})
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function UpdateUserHandler(request: FastifyRequest<{Body: UpdateUserInput}>,reply: FastifyReply) {
    const { email, password, currentEmail, currentPassword } = request.body
    const { user_id } = await request.user as { user_id: string }
    try {
        if(currentEmail != '' && email != '' && currentEmail && email) {
            const dbCurrentMail = await prisma.user.findUnique({
                where:{email: currentEmail},
            })
            if(!dbCurrentMail) reply.code(400).send({message: "The email you typed is not the current email. Please type the current email."})
            await prisma.user.update({
                where:{id: user_id},
                data:{email}
            })
        }
        if(currentPassword != '' && password != "" && currentPassword && password){
            const dbUser = await prisma.user.findUnique({
                where:{id: user_id}
            })
            // @ts-ignore
            const verify = await verifyPassword(currentPassword,dbUser?.password)
            if(verify) reply.code(400).send({message: "The password you typed is not the current password. Please type the current password."})
            const hash = await hashPassword(currentPassword)
            await prisma.user.update({
                where:{id: user_id},
                data:{password: hash}
            })
            reply.code(200).send({message: "Successfully changed email"})
        }
        reply.code(400).send({message: "Please fill in all of the information"})
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetUserHandler(request: FastifyRequest<any>, reply: FastifyReply) {
    try {
        const { id } = await request.user as { id: string }
        const result = prisma.user.findUnique({
            where:{
                id
            },
            select: {
              email: true,
              name: true,
              id: true,
            },
          })
        reply.code(200).send(result)
    } catch (error) {
        return reply.code(500).send(error)
    }
}
