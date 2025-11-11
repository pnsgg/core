CREATE TYPE "public"."payment_methods" AS ENUM('CASH', 'PAYPAL', 'VISA', 'MASTERCARD', 'CB');--> statement-breakpoint
CREATE TYPE "public"."product_categories" AS ENUM('MERCHANDIZING', 'DRINKS', 'FOOD');--> statement-breakpoint
CREATE TYPE "public"."stock_movement_types" AS ENUM('IN', 'OUT', 'ADJUSTMENT', 'SALE', 'RETURN');--> statement-breakpoint
CREATE TYPE "public"."units_of_measurement" AS ENUM('UNIT', 'KILOGRAM', 'LITER');--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"allergens" text,
	"price" numeric(12, 2) NOT NULL,
	"category" "product_categories" NOT NULL,
	"quantity" numeric NOT NULL,
	"unit_of_measurement" "units_of_measurement" DEFAULT 'UNIT',
	"is_active" boolean DEFAULT true,
	"location" text
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"product_id" uuid,
	"quantity" numeric NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"firefly_id" text,
	"transaction_id" uuid,
	"event_id" uuid
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"product_id" uuid,
	"price" numeric(12, 2) NOT NULL,
	"quantity" numeric NOT NULL,
	"payment_method" "payment_methods" NOT NULL,
	"stancer_id" text,
	"event_id" uuid
);
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;