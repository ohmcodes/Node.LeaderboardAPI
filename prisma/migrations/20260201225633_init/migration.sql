-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "playername" TEXT,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);
