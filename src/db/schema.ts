import { pgEnum, integer, pgTable, varchar, timestamp, real, jsonb, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const rolesEnum = pgEnum("role", [
  "admin",
  "teacher",
  "student",
  "schoolkid",
]);

export const courseStatusEnum = pgEnum("course_status", ["draft", "publish", "archived"]);

/** Тип задания: Введение, Теория, Видео, Практика, Тест */
export const assignmentTypeEnum = pgEnum("assignment_type", [
  "introduction",
  "theory",
  "video",
  "practice",
  "test",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullname: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: rolesEnum().default("student").notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoryTable = pgTable("category", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  icon: varchar({ length: 50 }),
});

export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categoryTable.id, { onDelete: "restrict" }),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 1000 }),
  fullDescription: varchar({ length: 5000 }),
  level: varchar({ length: 50 }).default("beginner"),
  language: varchar({ length: 100 }).default("Русский"),
  price: integer().default(0),
  oldPrice: integer("old_price"),
  image: varchar({ length: 500 }),
  rating: real().default(0),
  reviewsCount: integer("reviews_count").default(0),
  studentsCount: integer("students_count").default(0),
  whatYouWillLearn: jsonb("what_you_will_learn").$type<string[]>(),
  requirements: jsonb("requirements").$type<string[]>(),
  status: courseStatusEnum().default("publish").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lessonsTable = pgTable("lessons", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 2000 }),
  duration: integer().default(0),
  order: integer().default(0),
  type: varchar({ length: 50 }).default("theory").notNull(),
});

/** Модули внутри урока (преподаватель добавляет модули к содержанию урока) */
export const modulesTable = pgTable("modules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 500 }).notNull(),
  order: integer().default(0),
});

/** Подмодули внутри модуля (задания: Введение, Теория, Видео, Практика, Тест) */
export const underModulesTable = pgTable("under_modules", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  moduleId: integer("module_id").notNull().references(() => modulesTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 500 }).notNull(),
  order: integer().default(0),
  type: assignmentTypeEnum().default("theory").notNull(),
  maxScore: integer("max_score").default(20).notNull(),
});

/** Контент подмодуля: текст и/или видео */
export const modulesContentTable = pgTable("modules_content", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  underModuleId: integer("under_module_id").notNull().references(() => underModulesTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 500 }).notNull(),
  text: varchar({ length: 10000 }),
  video: varchar({ length: 1000 }),
  order: integer().default(0),
});

/** Прохождение подмодуля пользователем + набранные баллы */
export const underModuleCompletionsTable = pgTable(
  'under_module_completions',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    underModuleId: integer('under_module_id').notNull().references(() => underModulesTable.id, { onDelete: 'cascade' }),
    completedAt: timestamp('completed_at').defaultNow().notNull(),
    score: integer().default(0).notNull(),
  },
  (t) => [unique().on(t.userId, t.underModuleId)]
);

export const enrollmentsTable = pgTable(
  "enrollments",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
    progressPercent: integer("progress_percent").default(0),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.courseId)]
);

export const favoritesTable = pgTable(
  "favorites",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  },
  (t) => [unique().on(t.userId, t.courseId)]
);

export const reviewsTable = pgTable(
  "reviews",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
    rating: integer().notNull(),
    comment: varchar({ length: 2000 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.courseId)]
);

export const lessonsRelations = relations(lessonsTable, ({ one, many }) => ({
  course: one(coursesTable),
  modules: many(modulesTable),
}));

export const modulesRelations = relations(modulesTable, ({ one, many }) => ({
  lesson: one(lessonsTable),
  underModules: many(underModulesTable),
}));

export const underModulesRelations = relations(underModulesTable, ({ one, many }) => ({
  module: one(modulesTable),
  content: many(modulesContentTable),
}));

export const modulesContentRelations = relations(modulesContentTable, ({ one }) => ({
  underModule: one(underModulesTable),
}));

export const underModuleCompletionsRelations = relations(underModuleCompletionsTable, ({ one }) => ({
  user: one(usersTable),
  underModule: one(underModulesTable),
}));

export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  author: one(usersTable),
  category: one(categoryTable),
  lessons: many(lessonsTable),
}));

export const enrollmentsRelations = relations(enrollmentsTable, ({ one }) => ({
  user: one(usersTable),
  course: one(coursesTable),
}));

export const favoritesRelations = relations(favoritesTable, ({ one }) => ({
  user: one(usersTable),
  course: one(coursesTable),
}));

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  user: one(usersTable),
  course: one(coursesTable),
}));
