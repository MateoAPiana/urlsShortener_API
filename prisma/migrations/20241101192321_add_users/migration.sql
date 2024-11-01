/*
  Warnings:

  - Added the required column `userID` to the `URLRegister` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_URLRegister" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url_original" TEXT NOT NULL,
    "url_shorted" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "countVisited" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "URLRegister_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_URLRegister" ("id", "url_original", "url_shorted") SELECT "id", "url_original", "url_shorted" FROM "URLRegister";
DROP TABLE "URLRegister";
ALTER TABLE "new_URLRegister" RENAME TO "URLRegister";
CREATE UNIQUE INDEX "URLRegister_url_shorted_key" ON "URLRegister"("url_shorted");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
