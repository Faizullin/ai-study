import { ISubject } from "./subject";

export interface Course {
  id: number;
  title: string;
  subject?: ISubject;
}
