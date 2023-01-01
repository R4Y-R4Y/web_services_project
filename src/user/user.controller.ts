import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { RegisterUserInput, SigninUserInput } from "./user.schema";
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
            const accessToken = server.jwt.sign(info,{expiresIn: "1h"})
            const refreshToken = server.jwt.sign(session,{expiresIn:"168h"})
            return reply.code(201).send({accessToken, refreshToken,...info})
        } else {
            return reply.code(401).send({message: "Sign in failed. Your password or email is invalid."})
        }
    } catch(error) {
        return reply.code(500).send(error)
    }
}

export async function RefreshUserHandler(request: FastifyRequest<{Body: SigninUserInput}>, reply: FastifyReply) {
    try {
        // @ts-ignore
        const decoded : {id: string, user_id: string, iat: number, exp: number} = request.user
        const id = decoded.id
        console.log(decoded)
        const user_id = decoded.user_id
        const session_db = await prisma.session.findUnique({
            where:{id}
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
        console.log(info)
        // @ts-ignore
        const accessToken = server.jwt.sign(info,{expiresIn: "1h"})
        const refreshToken = server.jwt.sign(session,{expiresIn:"168h"})
        return reply.code(201).send({accessToken, refreshToken})
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function UpdateUserHandler(request: FastifyRequest<{Body: SigninUserInput}>,reply: FastifyReply) {
    const {email, password} = request.body
    const { id } = await request.user as { id: string }
    console.log(request.user)
    try {
        const emailUpdate = await prisma.user.update({
            where:{id},
            data:{email}
        })
        console.log(emailUpdate)
        const hash = password ? await hashPassword(password) : null
        const passwordUpdate = password ? await prisma.user.update({
            where:{id},
            data:{password: hash} as { password: string }
        }) : null
        console.log(passwordUpdate)
        const result = passwordUpdate ? passwordUpdate : emailUpdate
        const message = passwordUpdate ? (emailUpdate ? "Successfully changed Email and Password!" :"Successfully changed password!") : "Successfully changed email!"
        reply.code(200).send({message})
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
