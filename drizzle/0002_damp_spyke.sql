CREATE TYPE "public"."tournament_bracket_types" AS ENUM('ROUND-ROBIN', 'SIMPLE', 'DOUBLE', 'MATCHMAKING', 'OTHER');--> statement-breakpoint
ALTER TABLE "sales" DROP CONSTRAINT "sales_stock_movement_id_stock_movements_id_fk";
--> statement-breakpoint
ALTER TABLE "tournaments" ALTER COLUMN "bracket_type" SET DEFAULT 'DOUBLE'::"public"."tournament_bracket_types";--> statement-breakpoint
ALTER TABLE "tournaments" ALTER COLUMN "bracket_type" SET DATA TYPE "public"."tournament_bracket_types" USING "bracket_type"::"public"."tournament_bracket_types";--> statement-breakpoint
ALTER TABLE "tournaments" ALTER COLUMN "bracket_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "product_sales" ADD COLUMN "index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN "type" "stock_movement_types" NOT NULL;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_stock_movement_id_stock_movements_id_fk" FOREIGN KEY ("stock_movement_id") REFERENCES "public"."stock_movements"("id") ON DELETE set null ON UPDATE no action;