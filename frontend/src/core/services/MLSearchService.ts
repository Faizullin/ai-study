import $api from "../http";
import { AxiosResponse } from "axios";
import { IDocument } from "../models/IDocument";
import { IDataResponse } from "../models/response/IDataResponse";

export default class MLSearchService {
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
  static async getPopularItems(): Promise<AxiosResponse<IDocument[]>> {
    return $api.get<IDocument[]>("/documents/popular/");
  }
  static async getFilters(): Promise<AxiosResponse<any>> {
    return $api.get<any>(`documents/filters/`);
  }
  static async getContentBasedML(
    id: number
  ): Promise<AxiosResponse<IDataResponse<IDocument>>> {
    return $api.get<IDataResponse<IDocument>>(`/mlrec/cb/${id}/`);
  }
  static async getCollaborativeFilteredML(
    filters?: any
  ): Promise<AxiosResponse<IDataResponse<IDocument>>> {
    return $api.get<IDataResponse<IDocument>>("/mlrec/cf/", {
      params: {
        ...filters,
      },
    });
  }
}
