export interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
}

interface CourseForCollapse {
  courseId: string;
  courseName: string;
  enrolledDate: string;
  duration: string;
  fee: number;
}
export interface User {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "STUDENT";
  name: string;
  isActive?: boolean;
  courses?: CourseForCollapse[];
}
