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
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_places" ("address", "breakfast", "category", "city", "created_at", "description", "dessert", "dinner", "district", "id", "image_url", "latitude", "longitude", "lunch", "priceRange", "snack", "title", "user_id") SELECT "address", "breakfast", "category", "city", "created_at", "description", "dessert", "dinner", "district", "id", "image_url", "latitude", "longitude", "lunch", "priceRange", "snack", "title", "user_id" FROM "places";
DROP TABLE "places";
ALTER TABLE "new_places" RENAME TO "places";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "username" TEXT,
    "password_hash" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT,
    "city" TEXT,
    "age" TEXT,
    "gender" TEXT,
    "interests" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER'
);
INSERT INTO "new_users" ("age", "bio", "city", "created_at", "email", "emailVerified", "gender", "id", "image", "interests", "name", "password_hash", "username") SELECT "age", "bio", "city", "created_at", "email", "emailVerified", "gender", "id", "image", "interests", "name", "password_hash", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
