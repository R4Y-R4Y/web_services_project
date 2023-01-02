/*
  Warnings:

  - You are about to drop the `_SessionToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_SessionToUser" DROP CONSTRAINT "_SessionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SessionToUser" DROP CONSTRAINT "_SessionToUser_B_fkey";

-- DropTable
DROP TABLE "_SessionToUser";

-- CreateIndex
CREATE UNIQUE INDEX "Session_user_id_key" ON "Session"("user_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
