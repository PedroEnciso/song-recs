DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'added', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "recommendation_table" ALTER COLUMN "recommender_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendation_table" ALTER COLUMN "status" SET DATA TYPE status;--> statement-breakpoint
ALTER TABLE "recommendation_table" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendation_table" ALTER COLUMN "spotify_song_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_table" ADD COLUMN "name" varchar NOT NULL;