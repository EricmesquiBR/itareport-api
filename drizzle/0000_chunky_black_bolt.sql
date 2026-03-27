CREATE TABLE "categories" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"street" varchar(100) NOT NULL,
	"district" varchar(20) NOT NULL,
	"city" varchar(30) NOT NULL,
	"lat" real NOT NULL,
	"lng" real NOT NULL,
	"validated" boolean DEFAULT false NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"category_id" varchar(64) NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"cpf" varchar(15) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;