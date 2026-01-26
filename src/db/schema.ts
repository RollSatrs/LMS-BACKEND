import { pgEnum, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("role", [
  "admin",
  "teacher",
  "student",
  "schoolkid",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullname: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: rolesEnum().default("student").notNull(),
});