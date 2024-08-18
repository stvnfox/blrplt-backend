/*
  Warnings:

  - Added the required column `url` to the `site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "site" ADD COLUMN     "url" TEXT NOT NULL;
