import prisma from "../utils/prisma";


// where the prisma functions gets called
export async function createUser(input) {
    const user = await prisma.user.create({
        data: input
    })
}