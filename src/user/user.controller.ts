import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { GetUserInput, RegisterUserInput, SignInUserInput } from "./user.schema";
import supabase from "../utils/supabase";
export async function registerUserHandler(request :FastifyRequest<{Body: RegisterUserInput}>, reply:FastifyReply) {
    const body = request.body;
    try {
        let { data, error } = await supabase.auth.signUp({
            email: body.email,
            password: body.password
        })
        
        if(error) throw error;
        
        reply.code(201).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function SignInUserHandler(request: FastifyRequest<{Body: SignInUserInput}>, reply: FastifyReply) {
    const body = request.body
    console.log(body)
    try{
        let { data, error } = await supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password
        })

        if(error) throw error;
    
        reply.code(201).send(data)
        
    } catch(error) {
        return reply.code(500).send(error)
    }
}

export async function SignOutUserHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        let { error } = await supabase.auth.signOut()
        if(error) throw error;
    
        reply.code(201).send({statusCode:201,message:"Logged out successfully"})
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function UpdateUserHandler(request: FastifyRequest<{Body: SignInUserInput}>,reply: FastifyReply) {
    const body = request.body
    console.log(body)
    try {
        const { data, error } = await supabase.auth.updateUser({
            email: body.email,
            password: body.password,
        })
  
        if(error) throw error;
    
        reply.code(201).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}

export async function GetUserHandler(request: FastifyRequest<any>, reply: FastifyReply) {
    try {
        let jwt = String(request.headers["authorization"])
        const {data, error} = await supabase.auth.getUser(jwt)
        
        if(error) throw error;
        
        reply.code(200).send(data)
    } catch (error) {
        return reply.code(500).send(error)
    }
}
