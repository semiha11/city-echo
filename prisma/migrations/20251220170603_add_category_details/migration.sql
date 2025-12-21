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
    "image_url" TEXT,
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
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_places" ("address", "breakfast", "category", "city", "created_at", "description", "dessert", "dinner", "district", "id", "image_url", "isApproved", "isPaid", "latitude", "longitude", "lunch", "museumCardAccepted", "priceRange", "snack", "title", "user_id") SELECT "address", "breakfast", "category", "city", "created_at", "description", "dessert", "dinner", "district", "id", "image_url", "isApproved", "isPaid", "latitude", "longitude", "lunch", "museumCardAccepted", "priceRange", "snack", "title", "user_id" FROM "places";
DROP TABLE "places";
ALTER TABLE "new_places" RENAME TO "places";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
