import { pgTable, text, timestamp, pgEnum, uuid, integer, boolean } from "drizzle-orm/pg-core";

// --- ENUMS ---
export const roleEnum = pgEnum("role", ["PARENT", "STUDENT", "TUTOR", "ADMIN"]);
export const verificationStatusEnum = pgEnum("verification_status", ["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED", "SUSPENDED"]);

// --- CORE TABLES ---
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  image: text("image"),
  role: roleEnum("role"), // Unassigned initially
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- PROFILES ---
export const parentProfiles = pgTable("parent_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id").references(() => parentProfiles.id, { onDelete: "cascade" }), // Nullable for older students
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).unique(), // If student logs in directly
  name: text("name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  class: text("class"),
  board: text("board"),
  learningPreferences: text("learning_preferences"),
  academicGoals: text("academic_goals"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tutorProfiles = pgTable("tutor_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  slug: text("slug").unique().notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"), // Cloudinary URL
  experienceYears: integer("experience_years").default(0),
  qualificationSummary: text("qualification_summary"),
  city: text("city").default("Patna"),
  hourlyRate: integer("hourly_rate"),
  monthlyStartingRate: integer("monthly_starting_rate"),
  verificationStatus: verificationStatusEnum("verification_status").default("PENDING").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- PLATFORM DATA (Future-proofing) ---
export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
});

export const academicClasses = pgTable("academic_classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(), // e.g., "Class 10"
  slug: text("slug").unique().notNull(),
});

// Join tables
export const tutorSubjects = pgTable("tutor_subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id, { onDelete: "cascade" }).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
});

export const tutorServiceAreas = pgTable("tutor_service_areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id, { onDelete: "cascade" }).notNull(),
  locality: text("locality").notNull(), // e.g., Kankarbagh
});

// --- PLACEHOLDERS FOR PHASE 2 ---
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Structure to be defined in Phase 2
  status: text("status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Cashfree integration to be defined in Phase 2
  status: text("status").default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
