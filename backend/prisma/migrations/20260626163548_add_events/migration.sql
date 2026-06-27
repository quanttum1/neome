-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "data" JSONB NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "pushTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_userId_pushTime_idx" ON "Event"("userId", "pushTime");

-- CreateIndex
CREATE INDEX "Event_userId_time_idx" ON "Event"("userId", "time");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
