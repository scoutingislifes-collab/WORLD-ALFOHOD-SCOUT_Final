import { Course, CourseCategory, CourseLevel, Lesson } from "@/data/academyTypes";

const STORE_KEY = "cheetahs_instructor_courses";

export interface InstructorCourse extends Course {
  instructorId: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface NewCourseInput {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  isFree: boolean;
  certificate: boolean;
  coverColor: string;
  skills: string[];
  requirements: string[];
}

export interface NewLessonInput {
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  description: string;
}

function load(): InstructorCourse[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(courses: InstructorCourse[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(courses));
}

function slugify(title: string): string {
  return title
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .toLowerCase()
    .substring(0, 60);
}

export const instructorStore = {
  getAll(instructorId: string): InstructorCourse[] {
    return load().filter((c) => c.instructorId === instructorId);
  },

  getById(id: string): InstructorCourse | undefined {
    return load().find((c) => c.id === id);
  },

  create(instructorId: string, instructorName: string, input: NewCourseInput): InstructorCourse {
    const courses = load();
    const now = new Date().toISOString();
    const id = `inst-${Date.now()}`;
    const slug = slugify(input.title) + "-" + Date.now();

    const course: InstructorCourse = {
      id,
      slug,
      ...input,
      skills: input.skills,
      requirements: input.requirements,
      lessonsCount: 0,
      enrolledCount: 0,
      rating: 0,
      isFeatured: false,
      isNew: true,
      instructor: {
        name: instructorName,
        title: "مدرّب معتمد",
        bio: "",
        avatarColor: "#1B6B35",
      },
      lessons: [],
      duration: "0 ساعة",
      instructorId,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };

    courses.push(course);
    save(courses);
    return course;
  },

  update(id: string, patch: Partial<InstructorCourse>): InstructorCourse | undefined {
    const courses = load();
    const idx = courses.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    courses[idx] = { ...courses[idx], ...patch, updatedAt: new Date().toISOString() };
    save(courses);
    return courses[idx];
  },

  publish(id: string): InstructorCourse | undefined {
    return instructorStore.update(id, { status: "published" });
  },

  delete(id: string) {
    const courses = load().filter((c) => c.id !== id);
    save(courses);
  },

  addLesson(courseId: string, input: NewLessonInput): InstructorCourse | undefined {
    const courses = load();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) return undefined;

    const lessonId = `lesson-${Date.now()}`;
    const lesson: Lesson = {
      id: lessonId,
      slug: slugify(input.title) + "-" + Date.now(),
      title: input.title,
      duration: input.duration,
      type: input.type,
      description: input.description,
    };

    courses[idx].lessons = [...courses[idx].lessons, lesson];
    courses[idx].lessonsCount = courses[idx].lessons.length;
    courses[idx].updatedAt = new Date().toISOString();
    save(courses);
    return courses[idx];
  },

  removeLesson(courseId: string, lessonId: string): InstructorCourse | undefined {
    const courses = load();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) return undefined;
    courses[idx].lessons = courses[idx].lessons.filter((l) => l.id !== lessonId);
    courses[idx].lessonsCount = courses[idx].lessons.length;
    courses[idx].updatedAt = new Date().toISOString();
    save(courses);
    return courses[idx];
  },

  simulateEnrollment(courseId: string) {
    const courses = load();
    const idx = courses.findIndex((c) => c.id === courseId);
    if (idx === -1) return;
    courses[idx].enrolledCount += 1;
    save(courses);
  },
};
