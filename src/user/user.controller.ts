import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { RefreshInput, RegisterUserInput, SigninUserInput, UpdateUserInput, VerifyUserInput } from "./user.schema";
import { hashPassword, verifyPassword } from "../utils/password";
import prisma from "../utils/prisma";
import { server } from "..";
import { createTransport } from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()
let transporter = createTransport({
    host:'smtp.gmail.com',
    port:587,
    auth:{
        user:process.env.SMTP_EMAIL,
        pass:process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})
export async function registerUserHandler(request :FastifyRequest<{Body: RegisterUserInput}>, reply:FastifyReply) {
    const body = request.body;
    try {
        const { password, name, email } = body;
        const userExist = await prisma.user.findFirst({
            where:{email}
        })   
        const hash = await hashPassword(password);
        if(userExist && !userExist.confirmed){
            await prisma.user.update({
                data:{
                    name,
                    email,
                    password: hash,
                },
                where:{email},
            });
        }else if (!userExist){
            await prisma.user.create({
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
        }else return reply.code(400).send({message:"There's already a user signed in with this address"})
        const user = await prisma.user.findFirst({
            where:{email},
            select:{
                id: true,
                name: true,
                email: true
            }
        })
        if(!user) return reply.code(500).send({message:"There's an internal error in the server."})
        const token = server.jwt.sign({user_id:user.id},{expiresIn:"1d"})
        let url = encodeURI(`http://${process.env.HOST+':'+process.env.PORT}/api/user/verify?token=${token}`)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email address',
            html: `Please click this link to verify your email address:<br><a href="${url}">Verify your email!</a>`
        };
        transporter.sendMail(mailOptions,function(error, info){
            if (error) {
                console.log(error);
                return reply.code(500).send(error)
            } else {
                console.log('Email sent: '+ info.response);
        }});
        reply.code(202).send(user)
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}

export async function VerifyUserHandler(request: FastifyRequest<{Querystring: VerifyUserInput}>, reply: FastifyReply) {
    try {
        let {token} = request.query
        let result = server.jwt.verify(token)
        console.log(result)
        if(!(result as {user_id: string}).user_id) return reply.code(400).send({message:'The email link is invalid'})
        const {user_id: id} = (result as {user_id: string})
        const user = await prisma.user.update({
            where:{id},
            data:{confirmed: true},
            select:{
                id: true,
                name: true,
                email: true,
                confirmed: true
            }
        })
        if(user){
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Verify your email address',
                html: `Your email ${user.email} is successfully verified.<br>You can now sign in`
            };
            transporter.sendMail(mailOptions,function(error, info){
                if (error) {
                    console.log(error);
                    return reply.code(500).send(error)
                } else {
                    console.log('Email sent: ' + info.response);
            }});
        }
        return reply.code(201).send(user)
    } catch (error) {
        console.log(error)
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
        if (!user) return reply.code(401).send({code:401 ,message: "Sign in failed. Your password or email is invalid."});
        if(!user.confirmed) return reply.code(401).send({code:401 ,message: "Please verify your email."});
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
        console.log(error)
        return reply.code(500).send(error)
    }
}

export async function RefreshUserHandler(request: FastifyRequest<{Querystring: RefreshInput}>, reply: FastifyReply) {
    try {
        const decoded : {id: string, user_id: string, refresh: boolean, iat: number, exp: number} = await server.jwt.verify(request.query.refreshToken)
        if(!decoded.refresh) return reply.code(400).send({message: "This is not a refresh token."})
        const {id, user_id} = decoded
        const session_db = await prisma.session.findUnique({
            where:{id}
        })
        if(!session_db) {
            await prisma.session.deleteMany({
                where:{user_id}
            })
            return reply.code(401).send({message: "There's no session with the given refresh token. Detected unintended usage of refresh token. Removed all sessions"})
        }
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
        console.log(error)
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
            change = true
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
            reply.code(200).send(user)
        }
        reply.code(400).send({message: "Please fill in some of the information"})
    } catch (error) {
        console.log(error)
        return reply.code(500).send(error)
    }
}

export async function GetUserHandler(request: FastifyRequest<any>, reply: FastifyReply) {
    try {
        const { user_id } = await request.user as { user_id: string }
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
        console.log(error)
        return reply.code(500).send(error)
    }
}
