-- CreateTable
CREATE TABLE "public"."RateLimit" (
    "id" TEXT NOT NULL,
    "actionName" TEXT NOT NULL,
    "lastAccess" TIMESTAMP(3) NOT NULL,
    "aliasId" INTEGER NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_aliasId_actionName_key" ON "public"."RateLimit"("aliasId", "actionName");

-- AddForeignKey
ALTER TABLE "public"."RateLimit" ADD CONSTRAINT "RateLimit_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "public"."Alias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
