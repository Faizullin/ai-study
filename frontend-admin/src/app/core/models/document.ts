export type DocType = "article" | "documentation" | "labwork" | "document";

export interface DocumentFileModel {
  id: number;
  url: string;
  name: string;
  extension: string;
  size: number;
}
export interface Document {
  id: number;
  title: string;
  description: string;
  content: string;
  subjects: any[];
  course: any;
  files?: DocumentFileModel[];
  featured_image: DocumentFileModel;
  created_at: string;
  updated_at: string;
}
