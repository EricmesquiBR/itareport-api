DROP INDEX "idx_report_votes_report_user";--> statement-breakpoint
CREATE UNIQUE INDEX "uq_report_votes_report_user" ON "report_votes" USING btree ("report_id","user_id");