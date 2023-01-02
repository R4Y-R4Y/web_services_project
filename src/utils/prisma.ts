import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const pageCount = 12
export default prisma;