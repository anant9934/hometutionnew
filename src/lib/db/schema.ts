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
  status: text("status").default("PENDING").notNull(), // PENDING, ACCEPTED, PAYMENT_PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED
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
  payerId: text("payer_id").references(() => users.id).notNull(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id).notNull(),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").default("INR").notNull(),
  status: text("status").default("CREATED").notNull(), // CREATED, PENDING, SUCCESS, FAILED, REFUND_PENDING, REFUNDED
  provider: text("provider").default("CASHFREE").notNull(),
  providerOrderId: text("provider_order_id").unique(),
  providerPaymentId: text("provider_payment_id").unique(),
  failureCode: text("failure_code"),
  failureMessage: text("failure_message"),
  paidAt: timestamp("paid_at", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commissions = pgTable("commissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  paymentId: uuid("payment_id").references(() => payments.id).notNull().unique(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id).notNull(),
  grossAmountPaise: integer("gross_amount_paise").notNull(),
  commissionRateBps: integer("commission_rate_bps").notNull(), // e.g. 1000 = 10%
  commissionAmountPaise: integer("commission_amount_paise").notNull(),
  tutorAmountPaise: integer("tutor_amount_paise").notNull(),
  status: text("status").default("PENDING").notNull(), // PENDING, EARNED, REFUNDED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payouts = pgTable("payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id).notNull(),
  amountPaise: integer("amount_paise").notNull(),
  status: text("status").default("PENDING").notNull(), // PENDING, PROCESSING, PAID, FAILED
  providerPayoutId: text("provider_payout_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: text("provider").notNull(), // e.g., CASHFREE
  eventId: text("event_id").notNull(), // from provider
  eventType: text("event_type").notNull(),
  processed: boolean("processed").default(false).notNull(),
  processedAt: timestamp("processed_at", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: text("actor_user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  metadata: text("metadata"), // JSON string of safe metadata
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

// Academic Hierarchy
export const chapters = pgTable("chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "cascade" }).notNull(),
  classId: uuid("class_id").references(() => academicClasses.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0).notNull(),
});

export const topics = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  chapterId: uuid("chapter_id").references(() => chapters.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0).notNull(),
});

// Entitlement Foundation
export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => studentProfiles.id, { onDelete: "cascade" }).notNull(),
  tutorId: uuid("tutor_id").references(() => tutorProfiles.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  classId: uuid("class_id").references(() => academicClasses.id).notNull(),
  bookingId: uuid("booking_id").references(() => bookings.id).notNull(),
  status: text("status").default("PENDING").notNull(), // PENDING, ACTIVE, EXPIRED, CANCELLED
  startDate: timestamp("start_date", { mode: "date" }),
  endDate: timestamp("end_date", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Learning Content
export const studyMaterials = pgTable("study_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  type: text("type").notNull(), // NOTE, WORKSHEET, PYQ, FORMULA_SHEET, MOCK_TEST, VIDEO
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  classId: uuid("class_id").references(() => academicClasses.id).notNull(),
  chapterId: uuid("chapter_id").references(() => chapters.id),
  topicId: uuid("topic_id").references(() => topics.id),
  fileUrl: text("file_url"), // Cloudinary URL
  thumbnailUrl: text("thumbnail_url"),
  accessLevel: text("access_level").default("ENROLLED").notNull(), // PUBLIC, ENROLLED, PREMIUM
  isPublished: boolean("is_published").default(false).notNull(),
  createdBy: text("created_by").references(() => users.id), // Admin user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Quiz Engine
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  type: text("type").default("PRACTICE").notNull(), // PRACTICE, WEEKLY, MOCK_TEST, COMPETITION
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  classId: uuid("class_id").references(() => academicClasses.id).notNull(),
  chapterId: uuid("chapter_id").references(() => chapters.id),
  topicId: uuid("topic_id").references(() => topics.id),
  durationMinutes: integer("duration_minutes"), // Null means unlimited
  totalMarks: integer("total_marks").default(0).notNull(),
  passingMarks: integer("passing_marks").default(0).notNull(),
  negativeMarksPerWrongAnswer: integer("negative_marks").default(0).notNull(), // e.g. 0 or 25 (meaning 0.25)
  isPublished: boolean("is_published").default(false).notNull(),
  startsAt: timestamp("starts_at", { mode: "date" }),
  endsAt: timestamp("ends_at", { mode: "date" }),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }).notNull(),
  questionText: text("question_text").notNull(),
  explanation: text("explanation"),
  marks: integer("marks").default(1).notNull(),
  type: text("type").default("MCQ").notNull(), // MCQ
  difficulty: text("difficulty").default("MEDIUM").notNull(), // EASY, MEDIUM, HARD
  order: integer("order").default(0).notNull(),
});

export const quizOptions = pgTable("quiz_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id").references(() => quizQuestions.id, { onDelete: "cascade" }).notNull(),
  optionText: text("option_text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(), // CRITICAL: Never send this to client before submit!
  order: integer("order").default(0).notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id).notNull(),
  studentId: uuid("student_id").references(() => studentProfiles.id).notNull(),
  status: text("status").default("IN_PROGRESS").notNull(), // IN_PROGRESS, SUBMITTED, ABANDONED
  score: integer("score"),
  percentage: integer("percentage"),
  correctCount: integer("correct_count"),
  incorrectCount: integer("incorrect_count"),
  unansweredCount: integer("unanswered_count"),
  timeTakenSeconds: integer("time_taken_seconds"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
});

export const quizAnswers = pgTable("quiz_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id").references(() => quizAttempts.id, { onDelete: "cascade" }).notNull(),
  questionId: uuid("question_id").references(() => quizQuestions.id).notNull(),
  selectedOptionId: uuid("selected_option_id").references(() => quizOptions.id), // Null if unanswered
  isCorrect: boolean("is_correct"),
  marksAwarded: integer("marks_awarded"), // Support negative marks
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
});

// Academic Performance & History
export const studentTopicPerformance = pgTable("student_topic_performance", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => studentProfiles.id, { onDelete: "cascade" }).notNull(),
  topicId: uuid("topic_id").references(() => topics.id, { onDelete: "cascade" }).notNull(),
  attemptsCount: integer("attempts_count").default(0).notNull(),
  correctCount: integer("correct_count").default(0).notNull(),
  incorrectCount: integer("incorrect_count").default(0).notNull(),
  averageAccuracy: integer("average_accuracy").default(0).notNull(), // 0-100
  status: text("status").default("UNKNOWN").notNull(), // STRONG, WEAK, UNKNOWN
  lastAttemptAt: timestamp("last_attempt_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Gamification & Rewards
export const leaderboards = pgTable("leaderboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }), // Nullable for global leaderboard
  studentId: uuid("student_id").references(() => studentProfiles.id).notNull(),
  scope: text("scope").default("WEEKLY").notNull(), // WEEKLY, GLOBAL
  rank: integer("rank"),
  score: integer("score").default(0).notNull(),
  timeTakenSeconds: integer("time_taken_seconds").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  certificateNumber: text("certificate_number").unique().notNull(),
  studentId: uuid("student_id").references(() => studentProfiles.id).notNull(),
  type: text("type").notNull(), // QUIZ_CHAMPION, TOP_PERFORMER
  title: text("title").notNull(),
  description: text("description"),
  metadata: text("metadata"), // JSON
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
