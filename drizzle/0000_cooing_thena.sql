CREATE TABLE `checkout_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`event_type` text NOT NULL,
	`metadata_json` text NOT NULL,
	`occurred_at` text NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `checkout_contacts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `checkout_contact_phones` (
	`contact_id` text NOT NULL,
	`phone` text NOT NULL,
	`phone_key` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`contact_id`, `phone_key`),
	FOREIGN KEY (`contact_id`) REFERENCES `checkout_contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_checkout_phones_key` ON `checkout_contact_phones` (`phone_key`);--> statement-breakpoint
CREATE TABLE `checkout_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_checkout_contacts_email` ON `checkout_contacts` (`email`);--> statement-breakpoint
CREATE TABLE `phonepe_payment_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`optin_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`amount_paise` integer NOT NULL CHECK(amount_paise >= 100),
	`currency` text DEFAULT 'INR' NOT NULL,
	`status` text NOT NULL,
	`phonepe_order_id` text,
	`transaction_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`paid_at` text,
	FOREIGN KEY (`optin_id`) REFERENCES `checkout_contacts`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `phonepe_payment_orders_phonepe_order_id_unique` ON `phonepe_payment_orders` (`phonepe_order_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `phonepe_payment_orders_transaction_id_unique` ON `phonepe_payment_orders` (`transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_phonepe_orders_email` ON `phonepe_payment_orders` (`email`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_phonepe_orders_status` ON `phonepe_payment_orders` (`status`,`updated_at`);--> statement-breakpoint
PRAGMA optimize;
