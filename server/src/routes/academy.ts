import { Router, type IRouter } from "express";
import { courses } from "../data/academy";

const router: IRouter = Router();

// In-memory store for enrollments
// Map<userEmail, Map<courseSlug, { enrollmentId, courseSlug, enrolledAt, lessonsCompleted: Set<string> }>>
const enrollmentsStore = new Map<string, Map<string, any>>();

router.get("/categories", (req, res) => {
  const categories = courses.reduce((acc, course) => {
    acc[course.category] = (acc[course.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const result = Object.entries(categories).map(([name, count]) => ({ name, count }));
  res.json(result);
});

router.get("/courses", (req, res) => {
  const { category, level, q, sort, page = "1", pageSize = "12" } = req.query;
  
  let filtered = [...courses];
  
  if (category) filtered = filtered.filter(c => c.category === category);
  if (level) filtered = filtered.filter(c => c.level === level);
  if (q) {
    const qStr = String(q).toLowerCase();
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(qStr) || 
      c.description.toLowerCase().includes(qStr)
    );
  }
  
  if (sort === "popular") filtered.sort((a, b) => b.enrolledCount - a.enrolledCount);
  else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "newest") filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  
  const p = parseInt(String(page), 10) || 1;
  const size = parseInt(String(pageSize), 10) || 12;
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / size);
  const items = filtered.slice((p - 1) * size, p * size);
  
  res.json({ items, total, page: p, pageSize: size, totalPages });
});

router.get("/courses/:slug", (req, res) => {
  const course = courses.find(c => c.slug === req.params.slug);
  if (!course) return res.status(404).json({ error: "Not found" });
  res.json(course);
});

router.get("/courses/:slug/lessons/:lessonSlug", (req, res) => {
  const course = courses.find(c => c.slug === req.params.slug);
  if (!course) return res.status(404).json({ error: "Course not found" });
  
  const lesson = course.lessons.find(l => l.slug === req.params.lessonSlug);
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });
  
  res.json(lesson);
});

router.post("/enrollments", (req, res) => {
  const { courseSlug, userEmail } = req.body;
  if (!courseSlug || !userEmail) return res.status(400).json({ error: "Missing fields" });
  
  if (!enrollmentsStore.has(userEmail)) {
    enrollmentsStore.set(userEmail, new Map());
  }
  
  const userEnrollments = enrollmentsStore.get(userEmail)!;
  if (userEnrollments.has(courseSlug)) {
    return res.json({ ok: true, message: "Already enrolled", ...userEnrollments.get(courseSlug) });
  }
  
  const enrollmentId = "ENR-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  const enrolledAt = new Date().toISOString();
  
  const newEnrollment = {
    enrollmentId,
    courseSlug,
    enrolledAt,
    lessonsCompleted: new Set<string>()
  };
  
  userEnrollments.set(courseSlug, newEnrollment);
  
  res.json({ ok: true, enrollmentId, enrolledAt });
});

router.get("/enrollments", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Missing email" });
  
  const userEnrollments = enrollmentsStore.get(String(email));
  if (!userEnrollments) return res.json([]);
  
  const result = Array.from(userEnrollments.values()).map(enr => {
    const course = courses.find(c => c.slug === enr.courseSlug);
    if (!course) return null;
    
    const progressPct = course.lessonsCount > 0 
      ? Math.round((enr.lessonsCompleted.size / course.lessonsCount) * 100) 
      : 0;
      
    return {
      enrollmentId: enr.enrollmentId,
      courseSlug: enr.courseSlug,
      enrolledAt: enr.enrolledAt,
      lessonsCompleted: Array.from(enr.lessonsCompleted),
      course,
      progressPct
    };
  }).filter(Boolean);
  
  res.json(result);
});

router.post("/progress", (req, res) => {
  const { enrollmentId, lessonSlug, completed } = req.body;
  if (!enrollmentId || !lessonSlug) return res.status(400).json({ error: "Missing fields" });
  
  let foundEnr: any = null;
  let foundEmail = "";
  
  for (const [email, userEnrs] of enrollmentsStore.entries()) {
    for (const enr of userEnrs.values()) {
      if (enr.enrollmentId === enrollmentId) {
        foundEnr = enr;
        foundEmail = email;
        break;
      }
    }
    if (foundEnr) break;
  }
  
  if (!foundEnr) return res.status(404).json({ error: "Enrollment not found" });
  
  if (completed) {
    foundEnr.lessonsCompleted.add(lessonSlug);
  } else {
    foundEnr.lessonsCompleted.delete(lessonSlug);
  }
  
  const course = courses.find(c => c.slug === foundEnr.courseSlug);
  const progressPct = course && course.lessonsCount > 0 
    ? Math.round((foundEnr.lessonsCompleted.size / course.lessonsCount) * 100) 
    : 0;
    
  res.json({ ok: true, progressPct, lessonsCompleted: Array.from(foundEnr.lessonsCompleted) });
});

export default router;
