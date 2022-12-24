import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { CreateUserInput } from "./user.schema";
import supabase from "../utils/supabase";
export async function registerUserHandler(request :FastifyRequest<{Body: CreateUserInput}>, reply:FastifyReply) {
    const body = request.body;
    console.log(request)
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