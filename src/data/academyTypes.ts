import { z } from "zod";

export type CourseCategory = 
  | "القيادة"
  | "السلامة والإسعافات"
  | "البيئة"
  | "المهارات الكشفية"
  | "التكنولوجيا والابتكار"
  | "العمل التطوعي"
  | "اللياقة والمغامرة"
  | "الأخلاق والقيم";

export type CourseLevel = "مبتدئ" | "متوسط" | "متقدم";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  description: string;
}

export interface Instructor {
  name: string;
  title: string;
  bio: string;
  avatarColor: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: string;
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  price: number;
  isFree: boolean;
  isFeatured: boolean;
  isNew: boolean;
  instructor: Instructor;
  skills: string[];
  requirements: string[];
  lessons: Lesson[];
  coverColor: string;
  certificate: boolean;
}

export interface Enrollment {
  enrollmentId: string;
  courseSlug: string;
  enrolledAt: string;
  lessonsCompleted: string[]; // array of lesson slugs
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
  progressPct: number;
}
