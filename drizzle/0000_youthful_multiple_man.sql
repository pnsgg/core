CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startgg_id" text NOT NULL,
	"name" text NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"series_id" uuid NOT NULL,
	"short_description" text,
	"long_description" text,
	"location_text" text NOT NULL,
	"total_slots" integer NOT NULL,
	"maximum_participation_fee" integer,
	CONSTRAINT "events_startggId_unique" UNIQUE("startgg_id")
);
--> statement-breakpoint
CREATE TABLE "fee_discounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"amount" integer NOT NULL,
	"event_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startgg_id" text NOT NULL,
	"name" text NOT NULL,
	"event_id" uuid NOT NULL,
	"slots" integer NOT NULL,
	"bracket_type" text DEFAULT 'DOUBLE',
	CONSTRAINT "tournaments_startggId_unique" UNIQUE("startgg_id")
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fee_discounts" ADD CONSTRAINT "fee_discounts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;