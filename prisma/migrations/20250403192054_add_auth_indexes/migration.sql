-- AlterTable
ALTER TABLE "auth"."users" ADD COLUMN     "email_verification_token" VARCHAR(255),
ADD COLUMN     "email_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "login_token" VARCHAR(255),
ADD COLUMN     "login_token_expires" TIMESTAMP(3),
ADD COLUMN     "password_changed_at" TIMESTAMP(3),
ADD COLUMN     "password_reset_expires" TIMESTAMP(3),
ADD COLUMN     "password_reset_token" VARCHAR(255),
ADD COLUMN     "refresh_token" VARCHAR(255),
ADD COLUMN     "refresh_token_expires" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "idx_password_reset_composite" ON "auth"."users"("password_reset_token", "password_reset_expires");

-- CreateIndex
CREATE INDEX "idx_email_verification_token" ON "auth"."users"("email_verification_token");

-- CreateIndex
CREATE INDEX "idx_refresh_token" ON "auth"."users"("refresh_token");

-- CreateIndex
CREATE INDEX "idx_login_token" ON "auth"."users"("login_token");
