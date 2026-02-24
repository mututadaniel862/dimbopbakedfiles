-- AlterTable
ALTER TABLE "auth"."cart" ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "auth"."order_items" ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "auth"."orders" ADD COLUMN     "updated_at" TIMESTAMP(3);
