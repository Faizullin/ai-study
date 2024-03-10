import { ICourse } from "./ICourse";
import { IFile } from "./IFile";
import { ISubject } from "./ISubject";
import { TimestampedModel } from "./TimestampedModel";

export interface IDocument extends TimestampedModel {
  title: string;
  description: string;
  content: string;
  featured_image?: IFile;
  files?: IFile[];
  subjects: ISubject[];
  course?: ICourse;
  rating_avg: number;
  rating_count: number;
  my_rating_value?: number;
}
