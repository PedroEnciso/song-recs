DROP TABLE "creator_table";--> statement-breakpoint
ALTER TABLE "playlist_table" DROP CONSTRAINT "playlist_table_creator_id_creator_table_id_fk";
--> statement-breakpoint
ALTER TABLE "playlist_table" ALTER COLUMN "creator_id" SET DATA TYPE varchar;