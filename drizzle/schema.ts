import { sqliteTable, AnySQLiteColumn, uniqueIndex, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: integer().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
},
(table) => [
	uniqueIndex("users_username_unique").on(table.username),
]);

