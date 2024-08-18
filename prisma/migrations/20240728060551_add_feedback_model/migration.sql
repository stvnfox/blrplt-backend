-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "howDidYouHear" TEXT NOT NULL,
    "purposeOfUse" TEXT NOT NULL,
    "recommend" BOOLEAN NOT NULL,
    "difficultFeatures" TEXT NOT NULL,
    "bugs" TEXT NOT NULL,
    "futureWants" TEXT NOT NULL,
    "otherSuggestions" TEXT NOT NULL,
    "likeMost" TEXT NOT NULL,
    "likeLeast" TEXT NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);
