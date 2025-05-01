/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "events_external_id_key" ON "events"("external_id");
