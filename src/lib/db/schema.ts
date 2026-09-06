import { pgTable, text, timestamp, pgEnum, uuid, integer, boolean } from "drizzle-orm/pg-core";

// --- ENUMS ---
export const roleEnum = pgEnum("role", ["PARENT", "STUDENT", "TUTOR", "ADMIN"]);
export const verificationStatusEnum = pgEnum("verification_status", ["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED", "SUSPENDED"]);

// --- CORE TABLES ---
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: roleEnum("role"), // Custom field: PARENT, STUDENT, TUTOR, ADMIN
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: {
      columns: [account.provider, account.providerAccountId],
    },
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: {
      columns: [vt.identifier, vt.token],
    },
  })
);

// --- PROFILES ---
export const parentProfiles = pgTable("parent_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id").references(() => parentProfiles.id, { onDelete: "cascade" }), // Nullable for older students
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).unique(), // If student logs in directly
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
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  slug: text("slug").unique().notNull(),
  displayName: text("display_name").notNull(),
  headline: text("headline"),
  bio: text("bio"),
  gender: text("gender"),
  phone: text("phone"),
  profileImage: text("profile_image"), // Cloudinary URL
  experienceYears: integer("experience_years").default(0),
  qualification: text("qualification"),
  qualificationDetails: text("qualification_details"),
  teachingApproach: text("teaching_approach"),
  city: text("city").default("Patna"),
  pincode: text("pincode"),
  hourlyRate: integer("hourly_rate"),
  monthlyStartingRate: integer("monthly_starting_rate"),
  trialPrice: integer("trial_price").default(0),
  verificationStatus: verificationStatusEnum("verification_status").default("PENDING").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
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

// --- PHASE 2/3/4 FOUNDATIONAL MODELS ---

export const pricingPlans = pgTable("pricing_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(), // e.g. "MONTHLY", "HOURLY"
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => studentProfiles.id).notNull(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id),
  classId: uuid("class_id").references(() => academicClasses.id),
  type: text("type").notNull(), // TRIAL, HOURLY, MONTHLY
  preferredDate: timestamp("preferred_date", { mode: "date" }),
  preferredTime: text("preferred_time"),
  startDate: timestamp("start_date", { mode: "date" }),
  message: text("message"),
  price: integer("price").notNull(), // in paise
  status: text("status").default("PENDING").notNull(), // PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookingSchedules = pgTable("booking_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // PRESENT, ABSENT, CANCELLED
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  amount: integer("amount").notNull(),
  status: text("status").default("PENDING").notNull(),
  cashfreeOrderId: text("cashfree_order_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commissions = pgTable("commissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").references(() => payments.id).notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payouts = pgTable("payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id).notNull(),
  amount: integer("amount").notNull(),
  status: text("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const complaints = pgTable("complaints", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  bookingId: uuid("booking_id").references(() => bookings.id),
  description: text("description").notNull(),
  status: text("status").default("OPEN").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- ACADEMIC ECOSYSTEM (Phase 4) ---

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  classId: uuid("class_id").references(() => academicClasses.id).notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }).notNull(),
  questionText: text("question_text").notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id).notNull(),
  studentId: uuid("student_id").references(() => studentProfiles.id).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const quizResults = pgTable("quiz_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id").references(() => quizAttempts.id).notNull(),
  score: integer("score").notNull(),
});

export const leaderboards = pgTable("leaderboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => studentProfiles.id).notNull(),
  points: integer("points").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const studyMaterials = pgTable("study_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  classId: uuid("class_id").references(() => academicClasses.id).notNull(),
  title: text("title").notNull(),
  fileUrl: text("file_url").notNull(), // Cloudinary URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => studentProfiles.id).notNull(),
  title: text("title").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
