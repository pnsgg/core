CREATE TYPE "public"."payment_methods" AS ENUM('VISA', 'MASTERCARD', 'CB', 'CASH', 'PAYPAL');--> statement-breakpoint
CREATE TYPE "public"."product_categories" AS ENUM('MERCHANDIZING', 'DRINKS', 'FOOD');--> statement-breakpoint
CREATE TYPE "public"."stock_movement_types" AS ENUM('BUY', 'SALE', 'LOSS', 'RETURN');--> statement-breakpoint
CREATE TYPE "public"."units_of_measurement" AS ENUM('UNIT', 'KILOGRAM', 'LITER');--> statement-breakpoint
CREATE TABLE "product_sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"quantity" numeric NOT NULL,
	"product_id" uuid NOT NULL,
	"sale_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"allergens" text,
	"price" numeric(12, 2) NOT NULL,
	"category" "product_categories" NOT NULL,
	"quantity" numeric NOT NULL,
	"unit_of_measurement" "units_of_measurement" DEFAULT 'UNIT' NOT NULL,
	"is_on_sale" boolean DEFAULT true NOT NULL,
	"location" text
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"payment_method" "payment_methods" NOT NULL,
	"stancer_id" text,
	"event_id" uuid,
	"stock_movement_id" uuid
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" numeric NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"firefly_id" text,
	"event_id" uuid
);
--> statement-breakpoint
ALTER TABLE "tournaments" ALTER COLUMN "bracket_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_sales" ADD CONSTRAINT "product_sales_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_stock_movement_id_stock_movements_id_fk" FOREIGN KEY ("stock_movement_id") REFERENCES "public"."stock_movements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;