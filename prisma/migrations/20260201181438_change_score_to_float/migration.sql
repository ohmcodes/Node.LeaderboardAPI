/*
  Warnings:

  - You are about to alter the column `score` on the `Leaderboard` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leaderboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" REAL NOT NULL
);
INSERT INTO "new_Leaderboard" ("id", "score") SELECT "id", "score" FROM "Leaderboard";
DROP TABLE "Leaderboard";
ALTER TABLE "new_Leaderboard" RENAME TO "Leaderboard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
