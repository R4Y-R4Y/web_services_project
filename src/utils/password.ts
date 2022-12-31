import * as bcrypt from "bcrypt"

export async function hashPassword(password:string) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

export async function verifyPassword(candidatePassword:string, hashedPassword:string) {
    return await bcrypt.compare(candidatePassword, hashedPassword)
}
