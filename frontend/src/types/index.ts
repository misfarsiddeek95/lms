export interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
  isPublished?: boolean;
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

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormDataModal {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface Enrollment {
  id: number;
  enrolledAt: Date;
  studentName: string;
  courseName: string;
  price: string;
  duration: string;
}

export interface createEnrollmentObj {
  userId: number;
  courseIds: number[];
}
