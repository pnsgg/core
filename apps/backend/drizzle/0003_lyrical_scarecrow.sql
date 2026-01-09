ALTER TABLE "stock_movements" ALTER COLUMN "product_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "series" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "series" ADD CONSTRAINT "series_slug_unique" UNIQUE("slug");