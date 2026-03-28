-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('FOCUS', 'SHORT_BREAK', 'LONG_BREAK');

-- CreateTable
CREATE TABLE "PomodoroSession" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER NOT NULL,
    "type" "SessionType" NOT NULL DEFAULT 'FOCUS',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PomodoroSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PomodoroSession" ADD CONSTRAINT "PomodoroSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PomodoroSession" ADD CONSTRAINT "PomodoroSession_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
