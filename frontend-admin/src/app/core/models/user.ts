export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles?: UserRole[];
}
export type UserRole = "teacher" | "student" | "admin";
