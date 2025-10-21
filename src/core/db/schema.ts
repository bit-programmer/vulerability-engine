import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull()
});
