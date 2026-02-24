/*
  Warnings:

  - The `report_content` column on the `reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "auth"."reports" ADD COLUMN     "report_month" TIMESTAMP(3),
DROP COLUMN "report_content",
ADD COLUMN     "report_content" JSONB;
