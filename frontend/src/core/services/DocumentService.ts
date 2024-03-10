import $api from "../http";
import { AxiosResponse } from "axios";
import { IDataResponse } from "../models/response/IDataResponse";
import { IDocument } from "../models/IDocument";

export default class DocumentService {
  static async getAll(
    filters?: any
  ): Promise<AxiosResponse<IDataResponse<IDocument>>> {
    return $api.get<IDataResponse<IDocument>>("/documents/", {
      params: {
        ...filters,
      },
    });
  }
  static async getById(id: number): Promise<AxiosResponse<IDocument>> {
    return $api.get<IDocument>(`/documents/${id}/`);
  }
  static async getPopularItems(
    filters?: any
  ): Promise<AxiosResponse<IDocument[]>> {
    return $api.get<IDocument[]>("/documents/popular/", {
      params: {
        ...filters,
      },
    });
  }
  static async getFilters(): Promise<AxiosResponse<any>> {
    return $api.get<any>(`/documents/filters/`);
  }
  static async rateDocument(
    id: number,
    value: number
  ): Promise<AxiosResponse<any>> {
    return $api.post<any>(`/documents/${id}/rate/`, {
      value,
    });
  }
}
