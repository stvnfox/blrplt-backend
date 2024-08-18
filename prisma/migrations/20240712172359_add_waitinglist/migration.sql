-- CreateTable
CREATE TABLE "waitingList" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "waitingList_pkey" PRIMARY KEY ("id")
);
