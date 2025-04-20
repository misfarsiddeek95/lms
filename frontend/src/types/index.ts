export interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
}
export interface User {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "STUDENT";
  name: string;
  isActive?: boolean;
}
