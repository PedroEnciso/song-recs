DO $$ BEGIN
 CREATE TYPE "public"."mood" AS ENUM('pending', 'added', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendation_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"recommender_id" varchar,
	"status" "mood",
	"spotify_song_id" varchar,
	"playlist_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommendation_table" ADD CONSTRAINT "recommendation_table_playlist_id_playlist_table_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
