/*
  Warnings:

  - A unique constraint covering the columns `[url_shorted]` on the table `URLRegister` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "URLRegister_url_shorted_key" ON "URLRegister"("url_shorted");
