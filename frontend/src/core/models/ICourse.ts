import { IFile } from "./IFile";
import { ISubject } from "./ISubject";
import { TimestampedModel } from "./TimestampedModel";

export interface ICourse extends TimestampedModel {
  title: string;
  subject: ISubject;
  image?: string;
}
