/*
  Warnings:

  - Added the required column `city` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_number` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "external_id" TEXT,
ADD COLUMN     "image_path" TEXT,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "street_number" TEXT NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;
