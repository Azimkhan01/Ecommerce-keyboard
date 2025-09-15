-- DropForeignKey
ALTER TABLE "public"."product" DROP CONSTRAINT "product_category_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
