import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { DocumentFileModel } from "../models/document";

export interface IDocumentUploadProps {
  document_id: number;
  type: "thumbnail" | "attach";
  [x: string | number | symbol]: unknown;
}

@Injectable({
  providedIn: "root",
})
export class DocumentFileModelService {
  constructor(private http: HttpClient) {}

  public uploadNewFile(data: IDocumentUploadProps, file: File) {
    const formData = new FormData();
    formData.append("document_id", data.document_id.toString());
    formData.append("type", data.type);
    formData.append("file", file);
    return this.http.post<any>(`/api/s/documents/files/`, formData).pipe(
      map((data: any) => {
        return {
          ...data,
        } as DocumentFileModel;
      })
    );
  }
  public deleteFile(id: number) {
    return this.http.delete<any>(`/api/s/documents/files/${id}/`);
  }
}
