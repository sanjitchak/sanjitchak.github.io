import { sql } from "drizzle-orm";
import { check, index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const checkoutContacts = sqliteTable("checkout_contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email", { mode: "text" }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("idx_checkout_contacts_email").on(table.email)]);

export const checkoutContactPhones = sqliteTable("checkout_contact_phones", {
  contactId: text("contact_id").notNull().references(() => checkoutContacts.id, { onDelete: "cascade" }),
  phone: text("phone").notNull(),
  phoneKey: text("phone_key").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [primaryKey({ columns: [table.contactId, table.phoneKey] }), index("idx_checkout_phones_key").on(table.phoneKey)]);

export const checkoutActivities = sqliteTable("checkout_activities", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").notNull().references(() => checkoutContacts.id, { onDelete: "restrict" }),
  eventType: text("event_type").notNull(),
  metadataJson: text("metadata_json").notNull(),
  occurredAt: text("occurred_at").notNull(),
});

export const phonepePaymentOrders = sqliteTable("phonepe_payment_orders", {
  id: text("id").primaryKey(),
  optinId: text("optin_id").notNull().references(() => checkoutContacts.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull(),
  phonepeOrderId: text("phonepe_order_id").unique(),
  transactionId: text("transaction_id").unique(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  paidAt: text("paid_at"),
}, (table) => [
  index("idx_phonepe_orders_email").on(table.email, table.createdAt),
  index("idx_phonepe_orders_status").on(table.status, table.updatedAt),
  check("phonepe_amount_minimum", sql`${table.amountPaise} >= 100`),
]);
