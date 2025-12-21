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
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_places" ("address", "category", "city", "created_at", "description", "district", "id", "image_url", "latitude", "longitude", "title", "user_id") SELECT "address", "category", "city", "created_at", "description", "district", "id", "image_url", "latitude", "longitude", "title", "user_id" FROM "places";
DROP TABLE "places";
ALTER TABLE "new_places" RENAME TO "places";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
