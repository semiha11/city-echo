/*
  Warnings:

  - You are about to drop the column `image_url` on the `places` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "place_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    CONSTRAINT "place_images_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "review_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    CONSTRAINT "review_images_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_places" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "priceRange" TEXT,
    "breakfast" BOOLEAN NOT NULL DEFAULT false,
    "lunch" BOOLEAN NOT NULL DEFAULT false,
    "dinner" BOOLEAN NOT NULL DEFAULT false,
    "dessert" BOOLEAN NOT NULL DEFAULT false,
    "snack" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "entranceFee" TEXT,
    "museumCardAccepted" BOOLEAN NOT NULL DEFAULT false,
    "photography" BOOLEAN NOT NULL DEFAULT false,
    "largeArea" BOOLEAN NOT NULL DEFAULT false,
    "petFriendly" BOOLEAN NOT NULL DEFAULT false,
    "playground" BOOLEAN NOT NULL DEFAULT false,
    "freeEntry" BOOLEAN NOT NULL DEFAULT false,
    "veganOption" BOOLEAN NOT NULL DEFAULT false,
    "outdoorSeating" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "wifi" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "noiseLevel" TEXT,
    "foodCourt" BOOLEAN NOT NULL DEFAULT false,
    "babyCare" BOOLEAN NOT NULL DEFAULT false,
    "blueFlag" BOOLEAN NOT NULL DEFAULT false,
    "sunbed" BOOLEAN NOT NULL DEFAULT false,
    "shower" BOOLEAN NOT NULL DEFAULT false,
    "tentRental" BOOLEAN NOT NULL DEFAULT false,
    "electricity" BOOLEAN NOT NULL DEFAULT false,
    "fireAllowed" BOOLEAN NOT NULL DEFAULT false,
    "caravanAccess" BOOLEAN NOT NULL DEFAULT false,
    "isFamilyFriendly" BOOLEAN NOT NULL DEFAULT false,
    "hasSmokingArea" BOOLEAN NOT NULL DEFAULT false,
    "alcoholStatus" TEXT,
    "duration" TEXT,
    "reservationRequired" BOOLEAN NOT NULL DEFAULT false,
    "bestTime" TEXT,
    "damAllowed" BOOLEAN NOT NULL DEFAULT false,
    "musicType" TEXT,
    "editorNote" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_places" ("address", "babyCare", "blueFlag", "breakfast", "caravanAccess", "category", "city", "created_at", "description", "dessert", "dinner", "district", "electricity", "entranceFee", "fireAllowed", "foodCourt", "freeEntry", "gym", "id", "isApproved", "isPaid", "largeArea", "latitude", "longitude", "lunch", "museumCardAccepted", "noiseLevel", "outdoorSeating", "parking", "petFriendly", "photography", "playground", "pool", "priceRange", "shower", "snack", "sunbed", "tentRental", "title", "user_id", "veganOption", "wifi") SELECT "address", "babyCare", "blueFlag", "breakfast", "caravanAccess", "category", "city", "created_at", "description", "dessert", "dinner", "district", "electricity", "entranceFee", "fireAllowed", "foodCourt", "freeEntry", "gym", "id", "isApproved", "isPaid", "largeArea", "latitude", "longitude", "lunch", "museumCardAccepted", "noiseLevel", "outdoorSeating", "parking", "petFriendly", "photography", "playground", "pool", "priceRange", "shower", "snack", "sunbed", "tentRental", "title", "user_id", "veganOption", "wifi" FROM "places";
DROP TABLE "places";
ALTER TABLE "new_places" RENAME TO "places";
CREATE UNIQUE INDEX "places_title_city_key" ON "places"("title", "city");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
