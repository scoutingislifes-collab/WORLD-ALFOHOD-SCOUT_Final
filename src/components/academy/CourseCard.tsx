import { motion } from "framer-motion";
import { Link } from "wouter";
import { Clock, BookOpen, Star, Users } from "lucide-react";
import { Course } from "../../data/academyTypes";
import { Badge } from "../ui/badge";

interface CourseCardProps {
  course: Course;
  index?: number;
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/academy/c/${course.slug}`}>
        <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col cursor-pointer block relative">
          {/* Cover */}
          <div 
            className="aspect-[16/10] relative overflow-hidden flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${course.coverColor}, ${course.coverColor}dd)` 
            }}
          >
            <BookOpen className="h-16 w-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-start">
              {course.isNew && (
                <Badge className="bg-accent text-accent-foreground font-bold hover:bg-accent border-none rounded-md px-2">
                  جديد
                </Badge>
              )}
              {course.isFeatured && (
                <Badge className="bg-primary text-primary-foreground font-bold hover:bg-primary border-none rounded-md px-2">
                  مميز
                </Badge>
              )}
            </div>
            
            {course.isFree && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-secondary text-secondary-foreground font-bold hover:bg-secondary border-none rounded-md px-2">
                  مجاني
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">
                {course.category}
              </span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {course.level}
              </span>
            </div>

            <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {course.subtitle}
            </p>

            <div className="flex items-center gap-3 mt-auto mb-4">
              <div 
                className="h-8 w-8 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm"
                style={{ backgroundColor: course.instructor.avatarColor }}
              >
                {getInitials(course.instructor.name)}
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground leading-none">{course.instructor.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{course.instructor.title}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border grid grid-cols-2 gap-y-2 gap-x-1 text-xs text-muted-foreground font-medium mb-4">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{course.lessonsCount} دروس</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>{course.enrolledCount} طالب</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-black text-lg">
                {course.isFree ? (
                  <span className="text-green-600 dark:text-green-400">مجاني</span>
                ) : (
                  <span className="text-secondary">${course.price.toFixed(2)}</span>
                )}
              </span>
              <span className="text-sm font-bold text-primary group-hover:underline">
                عرض التفاصيل
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
