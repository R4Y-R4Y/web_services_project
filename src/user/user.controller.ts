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
            return reply.code(201).send({accessToken: server.jwt.sign(info,{expiresIn: "60m"}) ,...info})
        } else {
            return reply.code(401).send({message: "Sign in failed. Your password or email is invalid."})
        }
    } catch(error) {
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
        const { id } = await request.jwtDecode() as { id: string }
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
